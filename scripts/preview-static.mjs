import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/client/", import.meta.url));
const configuredBase = process.env.VITE_BASE ?? "/cosmic-portfolio/";
const base =
  configuredBase === "/" ? "/" : `/${configuredBase.split("/").filter(Boolean).join("/")}/`;
const port = Number(process.env.PORT ?? 4173);
const pagesSimulation = process.env.PAGES_SIM === "1";

if (!existsSync(join(root, "index.html"))) {
  throw new Error("Build the site before running preview:static.");
}

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".ico", "image/x-icon"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"],
  [".pdf", "application/pdf"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".wasm", "application/wasm"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function contentTypeFor(path) {
  return contentTypes.get(extname(path).toLowerCase()) ?? "application/octet-stream";
}

function resolveRequest(requestPath) {
  const stripped =
    requestPath === base
      ? ""
      : requestPath.startsWith(base)
        ? requestPath.slice(base.length)
        : null;
  if (stripped === null) return { requested: null, stripped: null };
  return { requested: normalize(join(root, stripped)), stripped };
}

function notFound(response, requestPath) {
  if (pagesSimulation && existsSync(join(root, "404.html"))) {
    const notFoundPath = join(root, "404.html");
    response.writeHead(404, {
      "Content-Type": contentTypes.get(".html"),
      "Cache-Control": "no-store",
    });
    createReadStream(notFoundPath)
      .on("error", () => {
        if (response.headersSent) return;
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Internal server error");
      })
      .pipe(response);
    return;
  }
  response.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(`Not found: ${requestPath}`);
}

const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method not allowed");
    return;
  }

  let requestPath;
  try {
    requestPath = new URL(request.url ?? "/", `http://${request.headers.host}`).pathname;
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  // Support `/` for local convenience while still exercising configured BASE_URL.
  const effectivePath = requestPath === "/" ? base : requestPath;
  const { requested, stripped } = resolveRequest(effectivePath);
  if (!requested || stripped === null) {
    notFound(response, requestPath);
    return;
  }

  const relativePath = relative(root, requested);
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    notFound(response, requestPath);
    return;
  }

  // Only the configured application root maps to index.html. Directory URLs
  // like `/assets/` must not silently become a 200 HTML response.
  const target = stripped === "" ? join(root, "index.html") : requested;
  const isFile = existsSync(target) && statSync(target).isFile();
  if (!isFile) {
    notFound(response, requestPath);
    return;
  }

  const stats = statSync(target);
  const headers = {
    "Content-Type": contentTypeFor(target),
    "Content-Length": stats.size,
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
  };
  const range = request.headers.range;
  const match = range ? /^bytes=(\d*)-(\d*)$/.exec(range) : null;
  if (match) {
    const start = match[1] === "" ? undefined : Number(match[1]);
    const end = match[2] === "" ? undefined : Number(match[2]);
    if (
      (start === undefined && end === undefined) ||
      (start !== undefined && (!Number.isFinite(start) || start >= stats.size)) ||
      (end !== undefined && !Number.isFinite(end)) ||
      (start !== undefined && end !== undefined && start > end)
    ) {
      response.writeHead(416, { "Content-Range": `bytes */${stats.size}` });
      response.end();
      return;
    }
    const rangeStart = start ?? 0;
    const rangeEnd = end === undefined ? stats.size - 1 : Math.min(end, stats.size - 1);
    response.writeHead(206, {
      ...headers,
      "Content-Range": `bytes ${rangeStart}-${rangeEnd}/${stats.size}`,
      "Content-Length": rangeEnd - rangeStart + 1,
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(target, { start: rangeStart, end: rangeEnd }).pipe(response);
    return;
  }

  response.writeHead(200, headers);
  if (request.method === "HEAD") response.end();
  else
    createReadStream(target)
      .on("error", () => {
        if (response.headersSent) return;
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Internal server error");
      })
      .pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(
    `Static preview available at http://127.0.0.1:${port}${base} (Pages simulation: ${pagesSimulation})`,
  );
});
