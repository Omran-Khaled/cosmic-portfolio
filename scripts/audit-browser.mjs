import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir, platform } from "node:os";
import { join } from "node:path";

const REPORT_DIR = join(process.cwd(), "reports");
const URL_UNDER_TEST = process.argv[2] ?? "http://127.0.0.1:4173/cosmic-portfolio/";
const WAIT_MS = Number(process.argv[3] ?? 15000);
const WIDTH = Number(process.argv[4] ?? 1440);
const HEIGHT = Number(process.argv[5] ?? 900);
const STRICT = process.argv.includes("--strict") || process.env.AUDIT_STRICT === "1";
const EXTRA_FLAGS = (process.env.AUDIT_CHROME_FLAGS ?? "").split(" ").filter(Boolean);

// Third-party hosts that are outside our control; failures there are environment
// warnings, not release-critical product defects.
const THIRD_PARTY_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

function ensureReportsDir() {
  if (!existsSync(REPORT_DIR)) {
    mkdirSync(REPORT_DIR, { recursive: true });
  }
}

function reportPath() {
  ensureReportsDir();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").replace(/T/, "_").slice(0, 19);
  return join(REPORT_DIR, `cdp-report-${stamp}.json`);
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value, null, 2));
}

function isThirdParty(url) {
  try {
    const host = new URL(url).hostname;
    return THIRD_PARTY_HOSTS.includes(host);
  } catch {
    return false;
  }
}

function isLocalRequest(url) {
  try {
    const u = new URL(url);
    const test = new URL(URL_UNDER_TEST);
    return u.hostname === test.hostname && u.port === test.port && u.protocol === test.protocol;
  } catch {
    return false;
  }
}

// Benign, explicitly documented environment/library messages that must not fail
// the release gate on their own.
function isBenignConsoleMessage(text) {
  // Ignore only the exact known Three.Clock deprecation warning. Generic words
  // such as "deprecated", "vite", or "react-refresh" can appear in real errors.
  const normalized = (text ?? "").trim().replace(/\s+/g, " ");
  return /^THREE\.Clock: This module has been deprecated\. Please use THREE\.Timer instead\.?$/i.test(
    normalized,
  );
}

function resolveChrome() {
  const configured = process.env.CHROME_PATH ?? process.env.CHROME_BIN;
  if (configured) return configured;

  const plat = platform();
  const candidates =
    plat === "win32"
      ? [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files\\Chromium\\Application\\chrome.exe",
        ]
      : plat === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
          ]
        : ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"];

  for (const candidate of candidates) {
    const looksLikePath =
      candidate.includes("\\") || candidate.includes("/") || candidate.startsWith("/");
    if (looksLikePath) {
      if (existsSync(candidate)) return candidate;
    } else {
      // Bare command name: rely on PATH resolution at spawn time.
      return candidate;
    }
  }
  return null;
}

const CHROME = resolveChrome();
const startedAt = new Date().toISOString();
let chromeProc = null;
let ws = null;
let userDataDir = null;
let wsClosed = false;

const failures = [];
const consoleErrors = [];
const consoleWarnings = [];
const pageExceptions = [];
const failedRequests = [];

function fail(message) {
  failures.push(message);
}

function cleanup() {
  if (ws && !wsClosed) {
    try {
      ws.close();
    } catch {
      /* ignore */
    }
    wsClosed = true;
  }
  if (chromeProc) {
    try {
      chromeProc.kill();
    } catch {
      /* ignore */
    }
  }
  if (userDataDir && existsSync(userDataDir)) {
    try {
      rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

(async () => {
  const completedAt = () => new Date().toISOString();
  let navigationOk = false;
  let loadEventReceived = false;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    if (!CHROME) {
      fail(
        "BLOCKED: no Chrome/Chromium executable found. Set CHROME_PATH or CHROME_BIN, or install Chrome.",
      );
      const blockedReport = {
        url: URL_UNDER_TEST,
        viewport: `${WIDTH}x${HEIGHT}`,
        browser: null,
        blocked: true,
        strict: STRICT,
        blockReason: "no-browser",
        startedAt,
        completedAt: completedAt(),
        failures,
        consoleErrors,
        consoleWarnings,
        pageExceptions,
        failedRequests,
        passed: false,
      };
      writeJson(reportPath(), blockedReport);
      console.log(JSON.stringify(blockedReport, null, 2));
      process.exitCode = STRICT ? 1 : 0;
      return;
    }

    const port = 9222 + Math.floor(Math.random() * 500);
    userDataDir = mkdtempSync(join(tmpdir(), "cdp-audit-"));

    chromeProc = spawn(CHROME, [
      "--headless=new",
      "--no-sandbox",
      "--no-first-run",
      "--disable-dev-shm-usage",
      // WebGL is required to exercise the desktop 3D path. Do not disable GPU;
      // instead prevent software rasterization so a real WebGL context is used
      // when the host has a GPU.
      "--enable-gpu",
      "--disable-software-rasterizer",
      ...EXTRA_FLAGS,
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      `--window-size=${WIDTH},${HEIGHT}`,
      "about:blank",
    ]);

    chromeProc.on("exit", () => {
      /* process ended */
    });

    async function getTarget() {
      for (let attempt = 0; attempt < 60; attempt++) {
        if (chromeProc.exitCode !== null && chromeProc.exitCode !== undefined) {
          throw new Error(`Chrome exited early with code ${chromeProc.exitCode}`);
        }
        try {
          const res = await fetch(`http://127.0.0.1:${port}/json/list`);
          const targets = await res.json();
          const page = targets.find((t) => t.type === "page");
          if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
        } catch {
          /* chrome not ready yet */
        }
        await sleep(250);
      }
      throw new Error("Chrome DevTools endpoint never became available");
    }

    const wsUrl = await getTarget();
    ws = new WebSocket(wsUrl);
    let messageId = 0;
    const pending = new Map();

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        pending.get(message.id)(message.result);
        pending.delete(message.id);
        return;
      }
      if (message.method === "Runtime.consoleAPICalled") {
        const text = (message.params.args ?? [])
          .map((arg) => arg.value ?? arg.description ?? arg.unserializableValue ?? "")
          .join(" ");
        if (message.params.type === "error") {
          if (isBenignConsoleMessage(text)) consoleWarnings.push(text);
          else consoleErrors.push(text);
        } else if (message.params.type === "warning") {
          consoleWarnings.push(text);
        }
      }
      if (message.method === "Runtime.exceptionThrown") {
        const d = message.params.exceptionDetails;
        pageExceptions.push(d.exception?.description ?? d.text ?? "uncaught exception");
      }
      if (message.method === "Page.loadEventFired") {
        loadEventReceived = true;
        navigationOk = true;
      }
      if (message.method === "Network.loadingFailed") {
        const params = message.params;
        const url = params.request?.url ?? "";
        const entry = `${params.type} ${params.errorText} ${url} (${params.blockedReason ?? "no block reason"})`;
        if (isLocalRequest(url)) {
          failedRequests.push(entry);
        } else if (isThirdParty(url)) {
          consoleWarnings.push(`third-party request failed: ${url} (${params.errorText})`);
        } else {
          failedRequests.push(entry);
        }
      }
    });

    function send(method, params = {}) {
      const id = ++messageId;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`CDP method ${method} timed out`));
        }, 10000);
        pending.set(id, (result) => {
          clearTimeout(timer);
          resolve(result);
        });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve);
      ws.addEventListener("error", (err) => reject(err));
    });

    await send("Runtime.enable");
    await send("Network.enable");
    await send("Log.enable");
    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1,
      mobile: WIDTH < 768,
    });

    const navigateTimeout = setTimeout(() => {
      fail(`Navigation to ${URL_UNDER_TEST} timed out after ${WAIT_MS} ms`);
    }, WAIT_MS);

    try {
      await send("Page.navigate", { url: URL_UNDER_TEST });
      // Wait for the load event or the overall wait window.
      while (!loadEventReceived) {
        await sleep(100);
      }
    } catch (error) {
      fail(`Navigation to ${URL_UNDER_TEST} failed: ${error.message}`);
    } finally {
      clearTimeout(navigateTimeout);
    }

    // Allow hydration and client-side rendering to settle.
    await sleep(1000);

    // Validate the application actually rendered by evaluating the DOM.
    let dom = {};
    let domError = null;
    try {
      const evalResult = await send("Runtime.evaluate", {
        expression: `JSON.stringify({
          title: document.title,
          readyState: document.readyState,
          rootChildren: document.getElementById('root')?.childElementCount ?? -1,
          canvases: document.querySelectorAll('canvas').length,
          headings: [...document.querySelectorAll('h1,h2')].map(h => h.textContent.trim().slice(0,80)),
          links: [...document.querySelectorAll('a[href]')].length,
          emptyLinks: [...document.querySelectorAll('a[href]')].filter(a => !a.textContent.trim() && !a.getAttribute('aria-label')).length,
          buttonsWithoutLabel: [...document.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).length,
          imagesWithoutAlt: [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length,
          inputsWithoutLabel: [...document.querySelectorAll('input,select,textarea')].filter(i => !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby') && !document.querySelector('label[for="'+i.id+'"]')).length,
          htmlLang: document.documentElement.lang,
          h1Count: document.querySelectorAll('h1').length,
          mainCount: document.querySelectorAll('main').length,
          webglCanvas: (() => { const c = document.querySelector('canvas'); if (!c) return 'no-canvas'; const gl = c.getContext('webgl2') || c.getContext('webgl'); return gl ? 'context-ok' : 'no-context'; })(),
          documentHeight: document.documentElement.scrollHeight,
          bodyTextLen: document.body.innerText.length
        })`,
        returnByValue: true,
        awaitPromise: true,
      });
      dom = JSON.parse(evalResult?.result?.value ?? "{}");
    } catch (error) {
      domError = error.message;
      fail(`DOM evaluation failed: ${error.message}`);
    }

    if (!dom.readyState || dom.readyState !== "complete") {
      fail(`Document did not reach complete readyState (got ${dom.readyState ?? "none"})`);
    }
    if (domError) navigationOk = false;
    if (!navigationOk) fail(`Application did not navigate successfully to ${URL_UNDER_TEST}`);

    // Desktop: the 3D canvas and WebGL context are required.
    const isDesktop = WIDTH >= 768;
    if (isDesktop) {
      const canvasCount = Number(dom.canvases) || 0;
      if (canvasCount < 1) {
        fail(`Desktop viewport expected a 3D canvas but found ${canvasCount}`);
      }
      if (dom.webglCanvas !== "context-ok") {
        fail(`Desktop WebGL context not available (got ${dom.webglCanvas ?? "none"})`);
      }
    }

    // Release-critical assertions.
    for (const exception of pageExceptions) {
      fail(`Uncaught JavaScript exception: ${exception}`);
    }
    for (const request of failedRequests) {
      fail(`Failed local asset request: ${request}`);
    }
    if (!navigationOk) fail("Navigation assertion failed: application entry did not render");

    const report = {
      url: URL_UNDER_TEST,
      viewport: `${WIDTH}x${HEIGHT}`,
      browser: CHROME,
      blocked: false,
      strict: STRICT,
      startedAt,
      completedAt: completedAt(),
      navigation: { ok: navigationOk, loadEventReceived },
      dom,
      consoleErrors,
      consoleWarnings,
      pageExceptions,
      failedRequests,
      failures,
      passed: failures.length === 0,
    };

    writeJson(reportPath(), report);
    console.log(JSON.stringify(report, null, 2));

    if (failures.length > 0) {
      console.error(`Browser audit FAILED with ${failures.length} release-critical issue(s).`);
      process.exitCode = 1;
    } else {
      console.log("Browser audit passed: no release-critical failures detected.");
    }
  } catch (error) {
    fail(`Browser audit harness error: ${error.message}`);
    const report = {
      url: URL_UNDER_TEST,
      viewport: `${WIDTH}x${HEIGHT}`,
      browser: CHROME ?? null,
      blocked: false,
      strict: STRICT,
      startedAt,
      completedAt: completedAt(),
      failures,
      consoleErrors,
      consoleWarnings,
      pageExceptions,
      failedRequests,
      passed: false,
      harnessError: error.message,
    };
    try {
      writeJson(reportPath(), report);
    } catch {
      /* ignore */
    }
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  } finally {
    cleanup();
    if (STRICT && process.exitCode === undefined) {
      process.exitCode = 0;
    }
  }
})();
