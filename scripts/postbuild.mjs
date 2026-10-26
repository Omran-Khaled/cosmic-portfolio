import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";

const clientRoot = resolve(import.meta.dirname, "..", "dist", "client");
const indexPath = join(clientRoot, "index.html");
const notFoundPath = join(clientRoot, "404.html");
const configuredBase = process.env.VITE_BASE ?? "/cosmic-portfolio/";
const base =
  configuredBase === "/" ? "/" : `/${configuredBase.split("/").filter(Boolean).join("/")}/`;

if (!existsSync(indexPath)) {
  throw new Error(`Static build did not produce ${indexPath}`);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function isInside(child, parent) {
  const rel = relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

function injectHeadMeta(html, meta) {
  const charset = html.match(/<meta\b[^>]*\bcharset\s*=\s*["']?[^\s"'/>]+[^>]*>/i)?.[0];
  if (charset) return html.replace(charset, `${charset}\n    ${meta}`);
  const head = html.match(/<head\b[^>]*>/i)?.[0];
  if (!head) throw new Error("Generated HTML has no head element for release policy injection");
  return html.replace(head, `${head}\n    ${meta}`);
}

function inlineScriptHashes(html) {
  return [...html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) =>
      `'sha256-${createHash("sha256")
        .update(match[1] ?? "")
        .digest("base64")}'`,
  );
}

function removeCsp(html) {
  return html.replace(/<meta\b[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>\s*/gi, "");
}

function attachMainCsp(source) {
  let html = source;
  // Normalize only relative app-root asset references emitted by a build tool;
  // never rewrite external URLs or already base-aware paths.
  html = html.replaceAll('src="./assets/', `src="${base}assets/`);
  html = html.replaceAll('href="./assets/', `href="${base}assets/`);
  html = html.replaceAll('href="favicon.svg"', `href="${base}favicon.svg"`);
  html = removeCsp(html);

  // Hash exact emitted inline bootstrap bytes. This permits only those inline
  // scripts rather than enabling unsafe-inline or unsafe-eval for scripts.
  const hashes = inlineScriptHashes(html);
  const csp = [
    "default-src 'self'",
    `script-src 'self'${hashes.length ? ` ${hashes.join(" ")}` : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
  const referrerMeta = html.includes('name="referrer"')
    ? ""
    : '<meta name="referrer" content="strict-origin-when-cross-origin">';
  html = injectHeadMeta(html, `<meta http-equiv="Content-Security-Policy" content="${csp}">`);
  if (referrerMeta) html = injectHeadMeta(html, referrerMeta);
  return html;
}

function attachNotFoundCsp(source) {
  // This file is served by GitHub Pages instead of the app shell for unknown
  // paths. The base path must match the same build, including VITE_BASE="/".
  let html = source.replace(
    /const\s+base\s*=\s*["'][^"']*["'];/,
    `const base = ${JSON.stringify(base)};`,
  );
  if (!html.includes(`const base = ${JSON.stringify(base)};`)) {
    throw new Error("Could not set the configured base path in dist/client/404.html");
  }
  html = removeCsp(html);
  const hashes = inlineScriptHashes(html);
  const csp = [
    "default-src 'none'",
    `script-src${hashes.length ? ` ${hashes.join(" ")}` : " 'none'"}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");
  html = injectHeadMeta(html, `<meta http-equiv="Content-Security-Policy" content="${csp}">`);
  return html;
}

let html = readFileSync(indexPath, "utf8");
html = attachMainCsp(html);
if (!html.includes("</head>")) {
  throw new Error("Generated index.html has no closing </head> after release policy injection");
}

// Verify the actual entry script path and syntax-check every generated JS chunk.
const entryMatch = html.match(/<script\b[^>]*\bsrc=["']([^"']+\.m?js(?:\?[^"']*)?)["'][^>]*>/i);
if (!entryMatch?.[1]) throw new Error("Generated index.html has no application entry script");
const entryReference = entryMatch[1].split(/[?#]/, 1)[0] ?? entryMatch[1];
const entryRelative = entryReference.startsWith(base)
  ? entryReference.slice(base.length)
  : entryReference.replace(/^\.\//, "");
const entryPath = resolve(clientRoot, entryRelative);
if (!isInside(entryPath, clientRoot) || !existsSync(entryPath)) {
  throw new Error(
    `Application entry script is missing or outside the client artifact: ${entryReference}`,
  );
}

const jsFiles = walk(clientRoot).filter((file) => /\.m?js$/i.test(file));
if (jsFiles.length === 0) throw new Error("Static client output contains no JavaScript files");
for (const file of jsFiles) {
  execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
}

writeFileSync(indexPath, html);
if (existsSync(notFoundPath)) {
  writeFileSync(notFoundPath, attachNotFoundCsp(readFileSync(notFoundPath, "utf8")));
} else {
  throw new Error("Static build did not copy public/404.html into dist/client");
}
writeFileSync(join(clientRoot, ".nojekyll"), "");
console.log(
  `Static postbuild complete (base: ${base}; checked ${jsFiles.length} JavaScript files).`,
);
