import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const clientRoot = join(projectRoot, "dist", "client");
const port = Number(process.env.SMOKE_PORT ?? 4173);
const origin = `http://127.0.0.1:${port}`;
const configuredBase = process.env.VITE_BASE ?? "/cosmic-portfolio/";
const base =
  configuredBase === "/" ? "/" : `/${configuredBase.split("/").filter(Boolean).join("/")}/`;
const required = [{ path: "favicon.svg", type: "image/svg+xml", required: true }];
const optional = [
  { path: "cv/omran_khaled.pdf", type: "application/pdf" },
  { path: "Finora.mp4", type: "video/mp4" },
  { path: "khuta.mp4", type: "video/mp4" },
  { path: "library.mp4", type: "video/mp4" },
  { path: "Nexara.mp4", type: "video/mp4" },
  { path: "wandr.mp4", type: "video/mp4" },
];
const assetTypes = new Map([
  [".js", "text/javascript"],
  [".mjs", "text/javascript"],
  [".css", "text/css"],
  [".svg", "image/svg+xml"],
  [".pdf", "application/pdf"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".wasm", "application/wasm"],
  [".webmanifest", "application/manifest+json"],
]);

if (!existsSync(join(clientRoot, "index.html"))) {
  throw new Error("Static artifact is missing. Run the production build before smoke:static.");
}

const child = spawn(process.execPath, ["scripts/preview-static.mjs"], {
  cwd: projectRoot,
  env: { ...process.env, PORT: String(port), PAGES_SIM: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let childOutput = "";
child.stdout.on("data", (chunk) => (childOutput += chunk.toString()));
child.stderr.on("data", (chunk) => (childOutput += chunk.toString()));

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Static preview exited early:\n${childOutput}`);
    try {
      const response = await fetch(`${origin}/`);
      if (response.status === 200) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Timed out waiting for static preview:\n${childOutput}`);
}

async function checkHtmlRoot(path, label) {
  const response = await fetch(`${origin}${path}`);
  const type = response.headers.get("content-type") ?? "";
  assert.equal(response.status, 200, `${label}: expected HTTP 200`);
  assert.match(type, /^text\/html\b/i, `${label}: expected HTML content type, got ${type}`);
  const html = await response.text();
  assert.match(html, /<html\b/i, `${label}: response should be an HTML document`);
  assert.match(html, /Content-Security-Policy/i, `${label}: CSP meta tag missing`);
  console.log(`PASS ${label}: ${response.status} ${type}`);
  return html;
}

function findLocalAssets(html) {
  const references = new Set();
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
    const raw = match[1];
    if (!raw || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(raw)) {
      if (!raw || !/^https?:/i.test(raw)) continue;
    }
    let url;
    try {
      url = new URL(raw, `${origin}${base}`);
    } catch {
      continue;
    }
    if (url.origin !== origin) continue;
    const expectedType = assetTypes.get(extname(url.pathname).toLowerCase());
    if (!expectedType) continue;
    references.add(`${url.pathname}${url.search}`);
  }
  return [...references];
}

async function checkHtmlAssetResponses(html) {
  const assets = findLocalAssets(html);
  assert.ok(
    assets.some((asset) => /\.js(?:\?|$)/i.test(asset)),
    "HTML should expose an application JS asset",
  );
  for (const assetPath of assets) {
    const expectedType = assetTypes.get(extname(new URL(assetPath, origin).pathname).toLowerCase());
    const response = await fetch(`${origin}${assetPath}`, { method: "HEAD" });
    const contentType = response.headers.get("content-type") ?? "";
    assert.equal(response.status, 200, `${assetPath}: expected HTTP 200, got ${response.status}`);
    assert.ok(
      expectedType && contentType.toLowerCase().startsWith(expectedType),
      `${assetPath}: expected ${expectedType}, got ${contentType}`,
    );
    console.log(`PASS referenced asset ${assetPath}: ${response.status} ${contentType}`);
  }
}

async function checkStaticAsset(asset) {
  const path = `${base}${asset.path}`;
  const response = await fetch(`${origin}${path}`, { method: "HEAD" });
  const type = response.headers.get("content-type") ?? "";
  const inArtifact = existsSync(join(clientRoot, asset.path));
  if (inArtifact) {
    assert.equal(response.status, 200, `${asset.path}: bundled asset should return 200`);
    assert.ok(
      type.toLowerCase().startsWith(asset.type),
      `${asset.path}: expected ${asset.type}, got ${type}`,
    );
    console.log(`PASS asset ${asset.path}: ${response.status} ${type}`);
    return;
  }
  if (asset.required) assert.fail(`Required asset ${asset.path} is missing from dist/client`);
  assert.equal(
    response.status,
    404,
    `${asset.path}: absent optional asset must not return the SPA shell with HTTP 200`,
  );
  assert.ok(
    !type.toLowerCase().startsWith(asset.type),
    `${asset.path}: absent file cannot claim ${asset.type}`,
  );
  console.warn(`WARN optional asset ${asset.path}: absent (404 ${type})`);
}

try {
  await waitForServer();
  const rootHtml = await checkHtmlRoot("/", "local root / alias");
  const baseHtml = await checkHtmlRoot(base, `configured base ${base}`);
  assert.match(baseHtml, /assets\//, "configured-base HTML should reference built assets");
  await checkHtmlAssetResponses(baseHtml);

  const missingRouteResponse = await fetch(`${origin}${base}smoke-test-route`);
  assert.equal(
    missingRouteResponse.status,
    404,
    "unknown application route must use the 404 strategy",
  );
  assert.match(missingRouteResponse.headers.get("content-type") ?? "", /^text\/html\b/i);
  const missingRouteHtml = await missingRouteResponse.text();
  assert.match(
    missingRouteHtml,
    /location\.replace\(base \+ search \+ hash\)/,
    "404 page must redirect app routes back to the SPA base",
  );
  assert.match(missingRouteHtml, /Content-Security-Policy/i, "404 page must include its own CSP");
  console.log(
    `PASS unknown app deep link: ${missingRouteResponse.status} ${missingRouteResponse.headers.get("content-type")}`,
  );

  const missingAssetResponse = await fetch(`${origin}${base}assets/__smoke_missing__.js`);
  assert.equal(
    missingAssetResponse.status,
    404,
    "unknown static asset must not return the app shell with HTTP 200",
  );
  assert.match(
    missingAssetResponse.headers.get("content-type") ?? "",
    /^text\/html\b/i,
    "Pages simulation should serve 404.html for absent assets",
  );
  const missingAssetHtml = await missingAssetResponse.text();
  assert.match(
    missingAssetHtml,
    /isStaticAsset/,
    "404 strategy must distinguish static assets from app routes",
  );
  assert.notEqual(
    missingAssetHtml,
    rootHtml,
    "missing asset must not receive the application index shell",
  );
  console.log(
    `PASS missing static asset: ${missingAssetResponse.status} ${missingAssetResponse.headers.get("content-type")}`,
  );

  const missingDirectory = await fetch(`${origin}${base}assets/`, { method: "HEAD" });
  assert.equal(
    missingDirectory.status,
    404,
    "asset directories must not receive an HTML shell with HTTP 200",
  );
  console.log(
    `PASS missing assets directory: ${missingDirectory.status} ${missingDirectory.headers.get("content-type")}`,
  );

  for (const asset of [...required, ...optional]) await checkStaticAsset(asset);
  console.log("Static artifact smoke tests passed.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
  await new Promise((resolve) => {
    if (child.exitCode !== null) return resolve();
    child.once("exit", resolve);
    setTimeout(() => {
      if (child.exitCode === null) child.kill("SIGKILL");
      resolve();
    }, 1500).unref();
  });
}
