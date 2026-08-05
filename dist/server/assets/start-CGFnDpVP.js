import { t as renderErrorPage } from "../server.js";
import { n as createCsrfMiddleware, r as createMiddleware } from "./vendor-react-DCIJmF58.js";
import { n as createStart } from "./vendor-router-Dnt9P9oO.js";
//#region src/start.ts
if (typeof globalThis !== "undefined") {
	const originalWarn = console.warn.bind(console);
	console.warn = (...args) => {
		if (typeof args[0] === "string" && args[0].includes("THREE.Clock: This module has been deprecated")) return;
		originalWarn(...args);
	};
}
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var startInstance = createStart(() => ({ requestMiddleware: [errorMiddleware, csrfMiddleware] }));
//#endregion
export { startInstance };
