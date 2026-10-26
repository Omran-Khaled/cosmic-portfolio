import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { createHash } from "node:crypto";

const projectRoot = resolve(import.meta.dirname, "..");
const publicRoot = join(projectRoot, "public");
const clientRoot = join(projectRoot, "dist", "client");
const entry = join(clientRoot, "index.html");
const notFound = join(clientRoot, "404.html");
const configuredBase = process.env.VITE_BASE ?? "/cosmic-portfolio/";
const base =
  configuredBase === "/" ? "/" : `/${configuredBase.split("/").filter(Boolean).join("/")}/`;
const failures = [];
const warnings = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function localReference(reference) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) return null;
  return reference.split(/[?#]/, 1)[0];
}

function isInside(child, parent) {
  const rel = relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

function resolveHtmlAsset(reference, label = "HTML") {
  if (!reference.startsWith(base)) {
    fail(`${label} asset reference is outside base path ${base}: ${reference}`);
    return null;
  }
  const resolved = resolve(clientRoot, reference.slice(base.length));
  if (!isInside(resolved, clientRoot)) {
    fail(`${label} asset path escapes output directory: ${reference}`);
    return null;
  }
  if (!existsSync(resolved) || !statSync(resolved).isFile()) {
    fail(`Broken ${label} asset reference: ${reference}`);
    return null;
  }
  return resolved;
}

function inlineScriptHashes(html) {
  return [...html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) =>
      `'sha256-${createHash("sha256")
        .update(match[1] ?? "")
        .digest("base64")}'`,
  );
}

function validateCsp(html, label, requiredDirectives) {
  const matches = [
    ...html.matchAll(/<meta\b[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi),
  ];
  if (matches.length !== 1) {
    fail(`${label}: expected exactly one CSP meta tag; found ${matches.length}`);
    return;
  }

  const tag = matches[0]?.[0] ?? "";
  const cspContent = tag.match(/\bcontent\s*=\s*(["'])(.*?)\1/i)?.[2];
  if (!cspContent) {
    fail(`${label}: CSP meta tag has no content attribute`);
    return;
  }

  const directives = new Map(
    cspContent.split(";").map((part) => {
      const [name, ...values] = part.trim().split(/\s+/);
      return [name ?? "", values];
    }),
  );
  for (const directive of requiredDirectives) {
    if (!directives.has(directive)) {
      fail(`${label}: CSP missing required directive: ${directive}`);
    }
  }
  if (directives.get("script-src")?.includes("'unsafe-eval'")) {
    fail(`${label}: CSP script-src must not allow unsafe-eval`);
  }
  if (!directives.get("object-src")?.includes("'none'")) {
    fail(`${label}: CSP object-src must be 'none'`);
  }

  const scriptSources = directives.get("script-src") ?? [];
  const hashes = inlineScriptHashes(html);
  for (const hash of hashes) {
    if (!scriptSources.includes(hash)) {
      fail(`${label}: inline script is missing its exact CSP hash ${hash}`);
    }
  }
  const cspStart = matches[0]?.index ?? -1;
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (cspStart > (script.index ?? -1)) {
      fail(`${label}: CSP meta tag must appear before executable script elements`);
      break;
    }
  }
  return directives;
}

function extractAttributeTag(html, tagName, attribute, targetValue) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  for (const tag of tags) {
    const attr = tag.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, "i"))?.[1];
    const matchValue = tag.match(/\b(?:rel|property)=["']([^"']+)["']/i)?.[1];
    if (attr && matchValue?.toLowerCase() === targetValue.toLowerCase()) return attr;
  }
  return null;
}

// Required static shell and Pages metadata.
if (!existsSync(entry)) fail("Missing dist/client/index.html");
if (!existsSync(notFound)) fail("Missing dist/client/404.html");
if (!existsSync(join(clientRoot, ".nojekyll"))) {
  warn("Missing dist/client/.nojekyll; Pages may apply Jekyll processing");
}

if (existsSync(entry)) {
  const html = readFileSync(entry, "utf8");
  if (html.includes("localhost") || html.includes("127.0.0.1")) {
    fail("Generated HTML references a local development host");
  }

  validateCsp(html, "index.html", [
    "default-src",
    "script-src",
    "style-src",
    "img-src",
    "media-src",
    "font-src",
    "connect-src",
    "object-src",
    "base-uri",
    "form-action",
  ]);

  const references = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((reference) => typeof reference === "string")
    .map((reference) => localReference(reference))
    .filter((reference) => reference !== null);
  for (const reference of references) resolveHtmlAsset(reference, "index.html");

  if (!/<script\b[^>]*\bsrc=["'][^"']+\.m?js(?:\?[^"']*)?["']/i.test(html)) {
    fail("No application entry script found in generated HTML");
  }
  if (!/<link\b[^>]*\bhref=["'][^"']+\.css(?:\?[^"']*)?["']/i.test(html)) {
    warn(
      "No linked CSS file found in generated HTML; verify CSS is intentionally inlined or emitted",
    );
  }
  if (
    !new RegExp(
      `href=["']${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}favicon\\.svg["']`,
      "i",
    ).test(html)
  ) {
    fail("Generated HTML does not reference favicon.svg under the configured base path");
  }

  const canonical = extractAttributeTag(html, "link", "href", "canonical");
  const ogUrl = extractAttributeTag(html, "meta", "content", "og:url");
  if (!canonical || !ogUrl) {
    fail("Generated HTML must include canonical and Open Graph URL metadata");
  } else {
    try {
      const canonicalUrl = new URL(canonical);
      const ogUrlValue = new URL(ogUrl);
      if (canonicalUrl.protocol !== "https:" || ogUrlValue.protocol !== "https:") {
        fail("Canonical and Open Graph URLs must use HTTPS");
      }
      if (canonicalUrl.href !== ogUrlValue.href) {
        fail(`Canonical URL and og:url differ (${canonicalUrl.href} vs ${ogUrlValue.href})`);
      }
      console.log(`Metadata URLs: canonical=${canonicalUrl.href}; og:url=${ogUrlValue.href}`);
    } catch {
      fail("Canonical and Open Graph URLs must be absolute valid URLs");
    }
  }
}

if (existsSync(notFound)) {
  const html = readFileSync(notFound, "utf8");
  validateCsp(html, "404.html", [
    "default-src",
    "script-src",
    "object-src",
    "base-uri",
    "form-action",
  ]);
  if (!html.includes(`const base = ${JSON.stringify(base)};`)) {
    fail(`404.html does not use configured base path ${base}`);
  }
  if (!html.includes("location.replace(base + search + hash)")) {
    fail("404.html no longer returns unknown app routes to the SPA root");
  }
  if (!html.includes("isStaticAsset")) {
    fail("404.html must leave missing static assets on the 404 page");
  }
}

// All public files must be copied byte-for-byte or postprocessed intentionally
// in the client artifact.
for (const publicFile of walk(publicRoot)) {
  const relativePath = relative(publicRoot, publicFile);
  const builtPath = join(clientRoot, relativePath);
  if (!existsSync(builtPath)) {
    fail(`Public asset missing from client output: ${relativePath}`);
  }
}

// Parse emitted JS and ensure locally referenced chunks exist within the static artifact.
const jsFiles = walk(clientRoot).filter((file) => /\.m?js$/i.test(file));
if (jsFiles.length === 0) fail("Missing generated JavaScript in dist/client");
for (const file of jsFiles) {
  const size = statSync(file).size;
  if (size === 0) fail(`Empty JavaScript bundle emitted: ${relative(clientRoot, file)}`);
  else if (size > 90 * 1024 * 1024) fail(`File exceeds 90 MB: ${relative(clientRoot, file)}`);
  else if (size > 25 * 1024 * 1024) warn(`File exceeds 25 MB: ${relative(clientRoot, file)}`);
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch {
    fail(`Generated JavaScript does not parse: ${relative(clientRoot, file)}`);
  }

  const source = readFileSync(file, "utf8");
  const chunkReferences = [
    ...source.matchAll(
      /(?:\bfrom\s*|\bimport\s*\()\s*["']([^"']+\.(?:m?js|wasm)(?:\?[^"']*)?)["']/g,
    ),
  ]
    .map((match) => match[1])
    .filter((reference) => typeof reference === "string");
  for (const rawReference of chunkReferences) {
    const reference = rawReference.split(/[?#]/, 1)[0] ?? rawReference;
    const resolved = reference.startsWith(base)
      ? resolve(clientRoot, reference.slice(base.length))
      : reference.startsWith("/")
        ? resolve(clientRoot, reference.slice(1))
        : resolve(dirname(file), reference);
    if (!isInside(resolved, clientRoot)) {
      fail(
        `Chunk reference escapes client output: ${rawReference} in ${relative(clientRoot, file)}`,
      );
    } else if (!existsSync(resolved) || !statSync(resolved).isFile()) {
      fail(
        `Missing dynamic/static chunk ${rawReference} referenced by ${relative(clientRoot, file)}`,
      );
    }
  }
}

// Local CSS URLs (fonts/images) must resolve; external font hosts are allowed by CSP.
for (const cssFile of walk(clientRoot).filter((file) => extname(file).toLowerCase() === ".css")) {
  const css = readFileSync(cssFile, "utf8");
  const urls = [...css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)].map((match) => match[1]);
  for (const url of urls) {
    if (!url || /^(?:data:|https?:|\/\/|#)/i.test(url)) continue;
    const resolved = url.startsWith(base)
      ? resolve(clientRoot, url.slice(base.length))
      : resolve(dirname(cssFile), url.split(/[?#]/, 1)[0]);
    if (!isInside(resolved, clientRoot)) fail(`CSS URL escapes client output: ${url}`);
    else if (!existsSync(resolved)) {
      fail(`Missing CSS resource ${url} referenced by ${relative(clientRoot, cssFile)}`);
    }
  }
}

// Favicon is required. Owner-supplied CV and demos are optional and never fabricated.
const requiredAssets = ["favicon.svg"];
for (const asset of requiredAssets) {
  const file = join(clientRoot, asset);
  if (!existsSync(file) || !statSync(file).isFile()) {
    fail(`Required runtime asset missing: ${asset}`);
  }
}
const optionalMedia = [
  "cv/omran_khaled.pdf",
  "Finora.mp4",
  "khuta.mp4",
  "library.mp4",
  "Nexara.mp4",
  "wandr.mp4",
];
for (const asset of optionalMedia) {
  const available = existsSync(join(clientRoot, asset));
  if (!available) warn(`Optional owner-supplied media is not bundled: ${asset}`);
  console.log(`Asset manifest: ${asset} — ${available ? "present" : "not bundled (optional)"}`);
}

for (const file of walk(clientRoot)) {
  const size = statSync(file).size;
  if (size > 90 * 1024 * 1024) fail(`File exceeds 90 MB: ${relative(clientRoot, file)}`);
}

if (warnings.length > 0) {
  console.warn("Release validation warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (failures.length > 0) {
  console.error("Release validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Release validation passed (base ${base}; ${jsFiles.length} JavaScript files checked).`,
  );
}
