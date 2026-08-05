import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { a as crossSerializeStream, c as toCrossJSONAsync, d as toResponse, i as createStream, l as toCrossJSONStream, n as ReadableStreamPlugin, o as fromJSON, r as createPlugin, s as getCrossReferenceHeader, t as splitSetCookieString, u as H3Event } from "./vendor-PIXDq2Nm.js";
import "react";
import { RouterProvider } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
import { defineHandlerCallback, renderRouterToStream } from "@tanstack/react-router/ssr/server";
import { AsyncLocalStorage } from "node:async_hooks";
//#region node_modules/.pnpm/@tanstack+react-start-server@1.167.22_crossws@0.4.10_srvx@0.11.22__react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@tanstack/react-start-server/dist/esm/StartServer.js
function StartServer(props) {
	return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
//#endregion
//#region node_modules/.pnpm/@tanstack+react-start-server@1.167.22_crossws@0.4.10_srvx@0.11.22__react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@tanstack/react-start-server/dist/esm/defaultStreamHandler.js
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ jsx(StartServer, { router })
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/request-response.js
var GLOBAL_EVENT_STORAGE_KEY = Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
	return typeof value.then === "function";
}
function getSetCookieValues(headers) {
	const headersWithSetCookie = headers;
	if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
	const value = headers.get("set-cookie");
	return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
	if (response.ok) return;
	const eventSetCookies = getSetCookieValues(event.res.headers);
	if (eventSetCookies.length === 0) return;
	const responseSetCookies = getSetCookieValues(response.headers);
	response.headers.delete("set-cookie");
	for (const cookie of responseSetCookies) response.headers.append("set-cookie", cookie);
	for (const cookie of eventSetCookies) response.headers.append("set-cookie", cookie);
}
function attachResponseHeaders(value, event) {
	if (isPromiseLike(value)) return value.then((resolved) => {
		if (resolved instanceof Response) mergeEventResponseHeaders(resolved, event);
		return resolved;
	});
	if (value instanceof Response) mergeEventResponseHeaders(value, event);
	return value;
}
function requestHandler(handler) {
	return (request, requestOpts) => {
		let h3Event;
		try {
			h3Event = new H3Event(request);
		} catch (error) {
			if (error instanceof URIError) return new Response(null, {
				status: 400,
				statusText: "Bad Request"
			});
			throw error;
		}
		return toResponse(attachResponseHeaders(eventStorage.run({ h3Event }, () => handler(request, requestOpts)), h3Event), h3Event);
	};
}
function getH3Event() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event.h3Event;
}
function getResponse() {
	return getH3Event().res;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/constants.js
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/utils.js
/**
* Re-encode characters that are unsafe in URL paths.
* Includes ASCII control characters (0x00-0x1F, 0x7F) and a subset of the
* WHATWG URL "path percent-encode set" (", <, >, `, {, }).
*
* Space (0x20) is intentionally excluded — decodeURI decodes %20 to space
* and the router stores decoded spaces in location.pathname. The existing
* encodePathLikeUrl already handles re-encoding spaces for outgoing URLs.
*
* These characters are decoded by decodeURI but must remain percent-encoded
* in paths to match how upstream layers (CDNs, edge middleware, browsers)
* interpret the URL, preventing infinite redirect loops and path mismatches.
*/
var PATH_UNSAFE_RE = /[\x00-\x1f\x7f"<>`{}]/g;
function sanitizePathSegment(segment) {
	return segment.replace(PATH_UNSAFE_RE, (ch) => "%" + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"));
}
function decodeSegment(segment) {
	let decoded;
	try {
		decoded = decodeURI(segment);
	} catch {
		decoded = segment.replaceAll(/%[0-9A-F]{2}/gi, (match) => {
			try {
				return decodeURI(match);
			} catch {
				return match;
			}
		});
	}
	return sanitizePathSegment(decoded);
}
function decodePath(path) {
	if (!path) return {
		path,
		handledProtocolRelativeURL: false
	};
	if (!/[%\\\x00-\x1f\x7f]/.test(path) && !path.startsWith("//")) return {
		path,
		handledProtocolRelativeURL: false
	};
	const re = /%25|%5C/gi;
	let cursor = 0;
	let result = "";
	let match;
	while (null !== (match = re.exec(path))) {
		result += decodeSegment(path.slice(cursor, match.index)) + match[0];
		cursor = re.lastIndex;
	}
	result = result + decodeSegment(cursor ? path.slice(cursor) : path);
	let handledProtocolRelativeURL = false;
	if (result.startsWith("//")) {
		handledProtocolRelativeURL = true;
		result = "/" + result.replace(/^\/+/, "");
	}
	return {
		path: result,
		handledProtocolRelativeURL
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/invariant.js
function invariant() {
	throw new Error("Invariant failed");
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/lru-cache.js
function createLRUCache(max) {
	const cache = /* @__PURE__ */ new Map();
	let oldest;
	let newest;
	const touch = (entry) => {
		if (!entry.next) return;
		if (!entry.prev) {
			entry.next.prev = void 0;
			oldest = entry.next;
			entry.next = void 0;
			if (newest) {
				entry.prev = newest;
				newest.next = entry;
			}
		} else {
			entry.prev.next = entry.next;
			entry.next.prev = entry.prev;
			entry.next = void 0;
			if (newest) {
				newest.next = entry;
				entry.prev = newest;
			}
		}
		newest = entry;
	};
	return {
		get(key) {
			const entry = cache.get(key);
			if (!entry) return void 0;
			touch(entry);
			return entry.value;
		},
		set(key, value) {
			if (cache.size >= max && oldest) {
				const toDelete = oldest;
				cache.delete(toDelete.key);
				if (toDelete.next) {
					oldest = toDelete.next;
					toDelete.next.prev = void 0;
				}
				if (toDelete === newest) newest = void 0;
			}
			const existing = cache.get(key);
			if (existing) {
				existing.value = value;
				touch(existing);
			} else {
				const entry = {
					key,
					value,
					prev: newest
				};
				if (newest) newest.next = entry;
				newest = entry;
				if (!oldest) oldest = entry;
				cache.set(key, entry);
			}
		},
		clear() {
			cache.clear();
			oldest = void 0;
			newest = void 0;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/not-found.js
/** Determine if a value is a TanStack Router not-found error. */
function isNotFound(obj) {
	return obj?.isNotFound === true;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/root.js
/** Stable identifier used for the root route in a route tree. */
var rootRouteId = "__root__";
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/redirect.js
/** Check whether a value is a TanStack Router redirect Response. */
/** Check whether a value is a TanStack Router redirect Response. */
function isRedirect(obj) {
	return obj instanceof Response && !!obj.options;
}
/** True if value is a redirect with a resolved `href` location. */
/** True if value is a redirect with a resolved `href` location. */
function isResolvedRedirect(obj) {
	return isRedirect(obj) && !!obj.options.href;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/rewrite.js
/** Execute a location input rewrite if provided. */
function executeRewriteInput(rewrite, url) {
	const res = rewrite?.input?.({ url });
	if (res) {
		if (typeof res === "string") return new URL(res);
		else if (res instanceof URL) return res;
	}
	return url;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+history@1.162.0/node_modules/@tanstack/history/dist/esm/index.js
var stateIndexKey = "__TSR_index";
function createHistory(opts) {
	let location = opts.getLocation();
	const subscribers = /* @__PURE__ */ new Set();
	const notify = (action) => {
		location = opts.getLocation();
		subscribers.forEach((subscriber) => subscriber({
			location,
			action
		}));
	};
	const handleIndexChange = (action) => {
		if (opts.notifyOnIndexChange ?? true) notify(action);
		else location = opts.getLocation();
	};
	const tryNavigation = async ({ task, navigateOpts, ...actionInfo }) => {
		if (navigateOpts?.ignoreBlocker ?? false) {
			task();
			return;
		}
		const blockers = opts.getBlockers?.() ?? [];
		const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
		if (typeof document !== "undefined" && blockers.length && isPushOrReplace) for (const blocker of blockers) {
			const nextLocation = parseHref(actionInfo.path, actionInfo.state);
			if (await blocker.blockerFn({
				currentLocation: location,
				nextLocation,
				action: actionInfo.type
			})) {
				opts.onBlocked?.();
				return;
			}
		}
		task();
	};
	return {
		get location() {
			return location;
		},
		get length() {
			return opts.getLength();
		},
		subscribers,
		subscribe: (cb) => {
			subscribers.add(cb);
			return () => {
				subscribers.delete(cb);
			};
		},
		push: (path, state, navigateOpts) => {
			const currentIndex = location.state[stateIndexKey];
			state = assignKeyAndIndex(currentIndex + 1, state);
			tryNavigation({
				task: () => {
					opts.pushState(path, state);
					notify({ type: "PUSH" });
				},
				navigateOpts,
				type: "PUSH",
				path,
				state
			});
		},
		replace: (path, state, navigateOpts) => {
			const currentIndex = location.state[stateIndexKey];
			state = assignKeyAndIndex(currentIndex, state);
			tryNavigation({
				task: () => {
					opts.replaceState(path, state);
					notify({ type: "REPLACE" });
				},
				navigateOpts,
				type: "REPLACE",
				path,
				state
			});
		},
		go: (index, navigateOpts) => {
			tryNavigation({
				task: () => {
					opts.go(index);
					handleIndexChange({
						type: "GO",
						index
					});
				},
				navigateOpts,
				type: "GO"
			});
		},
		back: (navigateOpts) => {
			tryNavigation({
				task: () => {
					opts.back(navigateOpts?.ignoreBlocker ?? false);
					handleIndexChange({ type: "BACK" });
				},
				navigateOpts,
				type: "BACK"
			});
		},
		forward: (navigateOpts) => {
			tryNavigation({
				task: () => {
					opts.forward(navigateOpts?.ignoreBlocker ?? false);
					handleIndexChange({ type: "FORWARD" });
				},
				navigateOpts,
				type: "FORWARD"
			});
		},
		canGoBack: () => location.state[stateIndexKey] !== 0,
		createHref: (str) => opts.createHref(str),
		block: (blocker) => {
			if (!opts.setBlockers) return () => {};
			const blockers = opts.getBlockers?.() ?? [];
			opts.setBlockers([...blockers, blocker]);
			return () => {
				const blockers = opts.getBlockers?.() ?? [];
				opts.setBlockers?.(blockers.filter((b) => b !== blocker));
			};
		},
		flush: () => opts.flush?.(),
		destroy: () => opts.destroy?.(),
		notify
	};
}
function assignKeyAndIndex(index, state) {
	if (!state) state = {};
	const key = createRandomKey();
	return {
		...state,
		key,
		__TSR_key: key,
		[stateIndexKey]: index
	};
}
/**
* Create an in-memory history implementation.
* Ideal for server rendering, tests, and non-DOM environments.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/history-types
*/
function createMemoryHistory(opts = { initialEntries: ["/"] }) {
	const entries = opts.initialEntries;
	let index = opts.initialIndex ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1) : entries.length - 1;
	const states = entries.map((_entry, index) => assignKeyAndIndex(index, void 0));
	const getLocation = () => parseHref(entries[index], states[index]);
	let blockers = [];
	const _getBlockers = () => blockers;
	const _setBlockers = (newBlockers) => blockers = newBlockers;
	return createHistory({
		getLocation,
		getLength: () => entries.length,
		pushState: (path, state) => {
			if (index < entries.length - 1) {
				entries.splice(index + 1);
				states.splice(index + 1);
			}
			states.push(state);
			entries.push(path);
			index = Math.max(entries.length - 1, 0);
		},
		replaceState: (path, state) => {
			states[index] = state;
			entries[index] = path;
		},
		back: () => {
			index = Math.max(index - 1, 0);
		},
		forward: () => {
			index = Math.min(index + 1, entries.length - 1);
		},
		go: (n) => {
			index = Math.min(Math.max(index + n, 0), entries.length - 1);
		},
		createHref: (path) => path,
		getBlockers: _getBlockers,
		setBlockers: _setBlockers
	});
}
/**
* Sanitize a path to prevent open redirect vulnerabilities.
* Removes control characters and collapses leading double slashes.
*/
function sanitizePath(path) {
	let sanitized = path.replace(/[\x00-\x1f\x7f]/g, "");
	if (sanitized.startsWith("//")) sanitized = "/" + sanitized.replace(/^\/+/, "");
	return sanitized;
}
function parseHref(href, state) {
	const sanitizedHref = sanitizePath(href);
	const hashIndex = sanitizedHref.indexOf("#");
	const searchIndex = sanitizedHref.indexOf("?");
	const addedKey = createRandomKey();
	return {
		href: sanitizedHref,
		pathname: sanitizedHref.substring(0, hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : sanitizedHref.length),
		hash: hashIndex > -1 ? sanitizedHref.substring(hashIndex) : "",
		search: searchIndex > -1 ? sanitizedHref.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
		state: state || {
			[stateIndexKey]: 0,
			key: addedKey,
			__TSR_key: addedKey
		}
	};
}
function createRandomKey() {
	return (Math.random() + 1).toString(36).substring(7);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/manifest.js
function getAssetCrossOrigin(assetCrossOrigin, kind) {
	if (!assetCrossOrigin) return;
	if (typeof assetCrossOrigin === "string") return assetCrossOrigin;
	return assetCrossOrigin[kind];
}
function getManifestScriptFormat(manifest) {
	return manifest?.scriptFormat ?? "module";
}
function getScriptPreloadAttrs(manifest, link, assetCrossOrigin) {
	const preloadLink = resolveManifestAssetLink(link);
	const crossOrigin = getAssetCrossOrigin(assetCrossOrigin, "script") ?? preloadLink.crossOrigin;
	return {
		...getManifestScriptFormat(manifest) === "iife" ? {
			rel: "preload",
			as: "script"
		} : { rel: "modulepreload" },
		href: preloadLink.href,
		...crossOrigin ? { crossOrigin } : {}
	};
}
function resolveManifestAssetLink(link) {
	if (typeof link === "string") return {
		href: link,
		crossOrigin: void 0
	};
	return link;
}
function getStylesheetHref(asset) {
	return resolveManifestCssLink(asset).href;
}
function resolveManifestCssLink(link) {
	if (typeof link === "string") return {
		href: link,
		crossOrigin: void 0
	};
	return link;
}
function createInlineCssStyleAsset(css) {
	return {
		attrs: { suppressHydrationWarning: true },
		children: css
	};
}
function createInlineCssPlaceholderAsset() {
	return { attrs: { suppressHydrationWarning: true } };
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/ssr/constants.js
var GLOBAL_TSR = "$_TSR";
var TSR_SCRIPT_BARRIER_ID = "$tsr-stream-barrier";
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/ssr/serializer/transformer.js
/**
* Create a strongly-typed serialization adapter for SSR hydration.
* Use to register custom types with the router serializer.
*/
function createSerializationAdapter(opts) {
	return opts;
}
/** Create a Seroval plugin for server-side serialization only. */
/* @__NO_SIDE_EFFECTS__ */
function makeSsrSerovalPlugin(serializationAdapter, options) {
	return /* @__PURE__ */ createPlugin({
		tag: "$TSR/t/" + serializationAdapter.key,
		test: serializationAdapter.test,
		parse: { stream(value, ctx, _data) {
			return { v: ctx.parse(serializationAdapter.toSerializable(value)) };
		} },
		serialize(node, ctx, _data) {
			options.didRun = true;
			return GLOBAL_TSR + ".t.get(\"" + serializationAdapter.key + "\")(" + ctx.serialize(node.v) + ")";
		},
		deserialize: void 0
	});
}
/** Create a Seroval plugin for client/server symmetric (de)serialization. */
/* @__NO_SIDE_EFFECTS__ */
function makeSerovalPlugin(serializationAdapter) {
	return /* @__PURE__ */ createPlugin({
		tag: "$TSR/t/" + serializationAdapter.key,
		test: serializationAdapter.test,
		parse: {
			sync(value, ctx, _data) {
				return { v: ctx.parse(serializationAdapter.toSerializable(value)) };
			},
			async async(value, ctx, _data) {
				return { v: await ctx.parse(serializationAdapter.toSerializable(value)) };
			},
			stream(value, ctx, _data) {
				return { v: ctx.parse(serializationAdapter.toSerializable(value)) };
			}
		},
		serialize: void 0,
		deserialize(node, ctx, _data) {
			return serializationAdapter.fromSerializable(ctx.deserialize(node.v));
		}
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/ssr/serializer/RawStream.js
/**
* Marker class for ReadableStream<Uint8Array> that should be serialized
* with base64 encoding (SSR) or binary framing (server functions).
*
* Wrap your binary streams with this to get efficient serialization:
* ```ts
* // For binary data (files, images, etc.)
* return { data: new RawStream(file.stream()) }
*
* // For text-heavy data (RSC payloads, etc.)
* return { data: new RawStream(rscStream, { hint: 'text' }) }
* ```
*/
var RawStream = class {
	constructor(stream, options) {
		this.stream = stream;
		this.hint = options?.hint ?? "binary";
	}
};
var BufferCtor = globalThis.Buffer;
var hasNodeBuffer = !!BufferCtor && typeof BufferCtor.from === "function";
function uint8ArrayToBase64(bytes) {
	if (bytes.length === 0) return "";
	if (hasNodeBuffer) return BufferCtor.from(bytes).toString("base64");
	const CHUNK_SIZE = 32768;
	const chunks = [];
	for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
		const chunk = bytes.subarray(i, i + CHUNK_SIZE);
		chunks.push(String.fromCharCode.apply(null, chunk));
	}
	return btoa(chunks.join(""));
}
function base64ToUint8Array(base64) {
	if (base64.length === 0) return /* @__PURE__ */ new Uint8Array(0);
	if (hasNodeBuffer) {
		const buf = BufferCtor.from(base64, "base64");
		return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
	}
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
var RAW_STREAM_FACTORY_BINARY = Object.create(null);
var RAW_STREAM_FACTORY_TEXT = Object.create(null);
var RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY = (stream) => new ReadableStream({ start(controller) {
	stream.on({
		next(base64) {
			try {
				controller.enqueue(base64ToUint8Array(base64));
			} catch {}
		},
		throw(error) {
			controller.error(error);
		},
		return() {
			try {
				controller.close();
			} catch {}
		}
	});
} });
var textEncoderForFactory = new TextEncoder();
var RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT = (stream) => {
	return new ReadableStream({ start(controller) {
		stream.on({
			next(value) {
				try {
					if (typeof value === "string") controller.enqueue(textEncoderForFactory.encode(value));
					else controller.enqueue(base64ToUint8Array(value.$b64));
				} catch {}
			},
			throw(error) {
				controller.error(error);
			},
			return() {
				try {
					controller.close();
				} catch {}
			}
		});
	} });
};
var FACTORY_BINARY = `(s=>new ReadableStream({start(c){s.on({next(b){try{const d=atob(b),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}catch(_){}},throw(e){c.error(e)},return(){try{c.close()}catch(_){}}})}}))`;
var FACTORY_TEXT = `(s=>{const e=new TextEncoder();return new ReadableStream({start(c){s.on({next(v){try{if(typeof v==='string'){c.enqueue(e.encode(v))}else{const d=atob(v.$b64),a=new Uint8Array(d.length);for(let i=0;i<d.length;i++)a[i]=d.charCodeAt(i);c.enqueue(a)}}catch(_){}},throw(x){c.error(x)},return(){try{c.close()}catch(_){}}})}})})`;
function toBinaryStream(readable) {
	const stream = createStream();
	const reader = readable.getReader();
	(async () => {
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					stream.return(void 0);
					break;
				}
				stream.next(uint8ArrayToBase64(value));
			}
		} catch (error) {
			stream.throw(error);
		} finally {
			reader.releaseLock();
		}
	})();
	return stream;
}
function toTextStream(readable) {
	const stream = createStream();
	const reader = readable.getReader();
	const decoder = new TextDecoder("utf-8", { fatal: true });
	(async () => {
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					try {
						const remaining = decoder.decode();
						if (remaining.length > 0) stream.next(remaining);
					} catch {}
					stream.return(void 0);
					break;
				}
				try {
					const text = decoder.decode(value, { stream: true });
					if (text.length > 0) stream.next(text);
				} catch {
					stream.next({ $b64: uint8ArrayToBase64(value) });
				}
			}
		} catch (error) {
			stream.throw(error);
		} finally {
			reader.releaseLock();
		}
	})();
	return stream;
}
/**
* SSR Plugin - uses base64 or UTF-8+base64 encoding for chunks, delegates to seroval's stream mechanism.
* Used during SSR when serializing to JavaScript code for HTML injection.
*
* Supports two modes based on RawStream hint:
* - 'binary': Always base64 encode (default)
* - 'text': Try UTF-8 first, fallback to base64 for invalid UTF-8
*/
var RawStreamSSRPlugin = /* @__PURE__ */ createPlugin({
	tag: "tss/RawStream",
	extends: [/* @__PURE__ */ createPlugin({
		tag: "tss/RawStreamFactory",
		test(value) {
			return value === RAW_STREAM_FACTORY_BINARY;
		},
		parse: {
			sync(_value, _ctx, _data) {
				return {};
			},
			async async(_value, _ctx, _data) {
				return {};
			},
			stream(_value, _ctx, _data) {
				return {};
			}
		},
		serialize(_node, _ctx, _data) {
			return FACTORY_BINARY;
		},
		deserialize(_node, _ctx, _data) {
			return RAW_STREAM_FACTORY_BINARY;
		}
	}), /* @__PURE__ */ createPlugin({
		tag: "tss/RawStreamFactoryText",
		test(value) {
			return value === RAW_STREAM_FACTORY_TEXT;
		},
		parse: {
			sync(_value, _ctx, _data) {
				return {};
			},
			async async(_value, _ctx, _data) {
				return {};
			},
			stream(_value, _ctx, _data) {
				return {};
			}
		},
		serialize(_node, _ctx, _data) {
			return FACTORY_TEXT;
		},
		deserialize(_node, _ctx, _data) {
			return RAW_STREAM_FACTORY_TEXT;
		}
	})],
	test(value) {
		return value instanceof RawStream;
	},
	parse: {
		sync(value, ctx, _data) {
			const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
			return {
				hint: ctx.parse(value.hint),
				factory: ctx.parse(factory),
				stream: ctx.parse(createStream())
			};
		},
		async async(value, ctx, _data) {
			const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
			const encodedStream = value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
			return {
				hint: await ctx.parse(value.hint),
				factory: await ctx.parse(factory),
				stream: await ctx.parse(encodedStream)
			};
		},
		stream(value, ctx, _data) {
			const factory = value.hint === "text" ? RAW_STREAM_FACTORY_TEXT : RAW_STREAM_FACTORY_BINARY;
			const encodedStream = value.hint === "text" ? toTextStream(value.stream) : toBinaryStream(value.stream);
			return {
				hint: ctx.parse(value.hint),
				factory: ctx.parse(factory),
				stream: ctx.parse(encodedStream)
			};
		}
	},
	serialize(node, ctx, _data) {
		return "(" + ctx.serialize(node.factory) + ")(" + ctx.serialize(node.stream) + ")";
	},
	deserialize(node, ctx, _data) {
		const stream = ctx.deserialize(node.stream);
		return ctx.deserialize(node.hint) === "text" ? RAW_STREAM_FACTORY_CONSTRUCTOR_TEXT(stream) : RAW_STREAM_FACTORY_CONSTRUCTOR_BINARY(stream);
	}
});
/**
* Creates an RPC plugin instance that registers raw streams with a multiplexer.
* Used for server function responses where we want binary framing.
* Note: RPC always uses binary framing regardless of hint.
*
* @param onRawStream Callback invoked when a RawStream is encountered during serialization
*/
/* @__NO_SIDE_EFFECTS__ */
function createRawStreamRPCPlugin(onRawStream) {
	let nextStreamId = 1;
	return /* @__PURE__ */ createPlugin({
		tag: "tss/RawStream",
		test(value) {
			return value instanceof RawStream;
		},
		parse: {
			async async(value, ctx, _data) {
				const streamId = nextStreamId++;
				onRawStream(streamId, value.stream);
				return { streamId: await ctx.parse(streamId) };
			},
			stream(value, ctx, _data) {
				const streamId = nextStreamId++;
				onRawStream(streamId, value.stream);
				return { streamId: ctx.parse(streamId) };
			}
		},
		serialize() {
			throw new Error("RawStreamRPCPlugin.serialize should not be called. RPC uses JSON serialization, not JS code generation.");
		},
		deserialize() {
			throw new Error("RawStreamRPCPlugin.deserialize should not be called. Use createRawStreamDeserializePlugin on client.");
		}
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/ssr/serializer/seroval-plugins.js
var defaultSerovalPlugins = [
	/* @__PURE__ */ createPlugin({
		tag: "$TSR/Error",
		test(value) {
			return value instanceof Error;
		},
		parse: {
			sync(value, ctx) {
				return { message: ctx.parse(value.message) };
			},
			async async(value, ctx) {
				return { message: await ctx.parse(value.message) };
			},
			stream(value, ctx) {
				return { message: ctx.parse(value.message) };
			}
		},
		serialize(node, ctx) {
			return "new Error(" + ctx.serialize(node.message) + ")";
		},
		deserialize(node, ctx) {
			return new Error(ctx.deserialize(node.message));
		}
	}),
	RawStreamSSRPlugin,
	ReadableStreamPlugin
];
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/router-manifest.js
/**
* @description Returns the router manifest data that should be sent to the client.
* This includes only the assets and preloads for the current route and any
* special assets that are needed for the client. It does not include relationships
* between routes or any other data that is not needed for the client.
*
* @param matchedRoutes - In dev mode, the matched routes are used to build
* the dev styles URL for route-scoped CSS collection.
*/
async function getStartManifest(matchedRoutes) {
	const { tsrStartManifest } = await import("./_tanstack-start-manifest_v-C3jy5ycT.js");
	const startManifest = tsrStartManifest();
	let routes = startManifest.routes;
	routes[rootRouteId];
	const manifestRoutes = {};
	for (const k in routes) {
		const v = routes[k];
		const result = {};
		if (v.preloads && v.preloads.length > 0) result.preloads = v.preloads;
		if (v.scripts && v.scripts.length > 0) result.scripts = v.scripts;
		if (v.css?.length) result.css = v.css;
		if (result.preloads || result.scripts || result.css) manifestRoutes[k] = result;
	}
	return {
		...startManifest.scriptFormat ? { scriptFormat: startManifest.scriptFormat } : {},
		...startManifest.inlineCss ? { inlineCss: startManifest.inlineCss } : {},
		routes: manifestRoutes
	};
}
//#endregion
//#region \0%23tanstack-start-server-fn-resolver
var manifest = {};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-client-core@1.170.14/node_modules/@tanstack/start-client-core/dist/esm/constants.js
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
/** Content-Type for multiplexed framed responses (RawStream support) */
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
/**
* Frame types for binary multiplexing protocol.
*/
var FrameType = {
	/** Seroval JSON chunk (NDJSON line) */
	JSON: 0,
	/** Raw stream data chunk */
	CHUNK: 1,
	/** Raw stream end (EOF) */
	END: 2,
	/** Raw stream error */
	ERROR: 3
};
/** Full Content-Type header value with version parameter */
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
//#endregion
//#region node_modules/.pnpm/@tanstack+start-client-core@1.170.14/node_modules/@tanstack/start-client-core/dist/esm/safeObjectMerge.js
function isSafeKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
/**
* Merge target and source into a new null-proto object, filtering dangerous keys.
*/
function safeObjectMerge(target, source) {
	const result = Object.create(null);
	if (target) {
		for (const key of Object.keys(target)) if (isSafeKey(key)) result[key] = target[key];
	}
	if (source && typeof source === "object") {
		for (const key of Object.keys(source)) if (isSafeKey(key)) result[key] = source[key];
	}
	return result;
}
/**
* Create a null-prototype object, optionally copying from source.
*/
function createNullProtoObject(source) {
	if (!source) return Object.create(null);
	const obj = Object.create(null);
	for (const key of Object.keys(source)) if (isSafeKey(key)) obj[key] = source[key];
	return obj;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-storage-context@1.167.17/node_modules/@tanstack/start-storage-context/dist/esm/async-local-storage.js
var GLOBAL_STORAGE_KEY = Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
	return startStorage.run(context, fn);
}
function getStartContext(opts) {
	const context = startStorage.getStore();
	if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return context;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-client-core@1.170.14/node_modules/@tanstack/start-client-core/dist/esm/getStartOptions.js
var getStartOptions = () => getStartContext().startOptions;
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/ssr/headers.js
function toHeadersInstance(init) {
	if (init instanceof Headers) return init;
	else if (Array.isArray(init)) return new Headers(init);
	else if (typeof init === "object") return new Headers(init);
	else return null;
}
function mergeHeaders(...headers) {
	return headers.reduce((acc, header) => {
		const headersInstance = toHeadersInstance(header);
		if (!headersInstance) return acc;
		for (const [key, value] of headersInstance.entries()) if (key === "set-cookie") splitSetCookieString(value).forEach((cookie) => acc.append("set-cookie", cookie));
		else acc.set(key, value);
		return acc;
	}, new Headers());
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/ssr/ssr-match-id.js
function dehydrateSsrMatchId(id) {
	return id.replaceAll("/", "\0");
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-client-core@1.170.14/node_modules/@tanstack/start-client-core/dist/esm/createServerFn.js
function flattenMiddlewares(middlewares, maxDepth = 100) {
	const seen = /* @__PURE__ */ new Set();
	const flattened = [];
	const recurse = (middleware, depth) => {
		if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
		middleware.forEach((m) => {
			if (m.options.middleware) recurse(m.options.middleware, depth + 1);
			if (!seen.has(m)) {
				seen.add(m);
				flattened.push(m);
			}
		});
	};
	recurse(middlewares, 0);
	return flattened;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-client-core@1.170.14/node_modules/@tanstack/start-client-core/dist/esm/createMiddleware.js
var createMiddleware = (options, __opts) => {
	const resolvedOptions = {
		type: "request",
		...__opts || options
	};
	const setValidator = (validator) => {
		return createMiddleware({}, Object.assign(resolvedOptions, {
			validator,
			inputValidator: validator
		}));
	};
	return {
		options: resolvedOptions,
		middleware: (middleware) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
		},
		validator: setValidator,
		inputValidator: setValidator,
		client: (client) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { client }));
		},
		server: (server) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { server }));
		}
	};
};
//#endregion
//#region node_modules/.pnpm/@tanstack+start-client-core@1.170.14/node_modules/@tanstack/start-client-core/dist/esm/createCsrfMiddleware.js
var innerCreateCsrfMiddleware = (opts = {}) => {
	return createMiddleware().server(async (ctx) => {
		const csrfCtx = ctx;
		if (opts.filter && !await opts.filter(csrfCtx)) return ctx.next();
		if (await isCsrfRequestAllowed(opts, csrfCtx)) return ctx.next();
		return getFailureResponse(opts, csrfCtx);
	});
};
var createCsrfMiddleware = innerCreateCsrfMiddleware;
async function isCsrfRequestAllowed(opts, ctx) {
	const result = await getCsrfRequestValidationResult(opts, ctx);
	return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
async function getCsrfRequestValidationResult(opts, ctx) {
	const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
	if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
	const origin = ctx.request.headers.get("Origin");
	if (origin !== null) {
		if (opts.origin) return matchValue(opts.origin, origin, ctx);
		return origin === new URL(ctx.request.url).origin;
	}
	const referer = ctx.request.headers.get("Referer");
	if (referer === null || opts.referer === false) return;
	if (typeof opts.referer === "function") return opts.referer(referer, ctx);
	if (opts.origin) {
		const refererOrigin = getOriginFromUrl(referer);
		return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
	}
	return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
async function matchValue(matcher, value, ctx) {
	if (typeof matcher === "function") return matcher(value, ctx);
	if (Array.isArray(matcher)) return matcher.includes(value);
	return value === matcher;
}
function getOriginFromUrl(url) {
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
function isRefererSameOrigin(referer, requestOrigin) {
	if (referer === requestOrigin) return true;
	if (!referer.startsWith(requestOrigin)) return false;
	if (referer.length === requestOrigin.length) return true;
	const code = referer.charCodeAt(requestOrigin.length);
	return code === 47 || code === 63 || code === 35;
}
async function getFailureResponse(opts, ctx) {
	if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
	return opts.failureResponse?.clone() ?? new Response("Forbidden", { status: 403 });
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-client-core@1.170.14/node_modules/@tanstack/start-client-core/dist/esm/getDefaultSerovalPlugins.js
function getDefaultSerovalPlugins() {
	return [...(getStartOptions()?.serializationAdapters)?.map(makeSerovalPlugin) ?? [], ...defaultSerovalPlugins];
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/frame-protocol.js
/**
* Binary frame protocol for multiplexing JSON and raw streams over HTTP.
*
* Frame format: [type:1][streamId:4][length:4][payload:length]
* - type: 1 byte - frame type (JSON, CHUNK, END, ERROR)
* - streamId: 4 bytes big-endian uint32 - stream identifier
* - length: 4 bytes big-endian uint32 - payload length
* - payload: variable length bytes
*/
/** Cached TextEncoder for frame encoding */
var textEncoder = new TextEncoder();
/** Shared empty payload for END frames - avoids allocation per call */
var EMPTY_PAYLOAD = /* @__PURE__ */ new Uint8Array(0);
/**
* Encodes a single frame with header and payload.
*/
function encodeFrame(type, streamId, payload) {
	const frame = new Uint8Array(9 + payload.length);
	frame[0] = type;
	frame[1] = streamId >>> 24 & 255;
	frame[2] = streamId >>> 16 & 255;
	frame[3] = streamId >>> 8 & 255;
	frame[4] = streamId & 255;
	frame[5] = payload.length >>> 24 & 255;
	frame[6] = payload.length >>> 16 & 255;
	frame[7] = payload.length >>> 8 & 255;
	frame[8] = payload.length & 255;
	frame.set(payload, 9);
	return frame;
}
/**
* Encodes a JSON frame (type 0, streamId 0).
*/
function encodeJSONFrame(json) {
	return encodeFrame(FrameType.JSON, 0, textEncoder.encode(json));
}
/**
* Encodes a raw stream chunk frame.
*/
function encodeChunkFrame(streamId, chunk) {
	return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
/**
* Encodes a raw stream end frame.
*/
function encodeEndFrame(streamId) {
	return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
/**
* Encodes a raw stream error frame.
*/
function encodeErrorFrame(streamId, error) {
	const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
	return encodeFrame(FrameType.ERROR, streamId, textEncoder.encode(message));
}
/**
* Creates a multiplexed ReadableStream from JSON stream and raw streams.
*
* The JSON stream emits NDJSON lines (from seroval's toCrossJSONStream).
* Raw streams are pumped concurrently, interleaved with JSON frames.
*
* Supports late stream registration for RawStreams discovered after initial
* serialization (e.g., from resolved Promises).
*
* @param jsonStream Stream of JSON strings (each string is one NDJSON line)
* @param rawStreams Map of stream IDs to raw binary streams (known at start)
* @param lateStreamSource Optional stream of late registrations for streams discovered later
*/
function createMultiplexedStream(jsonStream, rawStreams, lateStreamSource) {
	let controller;
	let cancelled = false;
	const readers = [];
	const enqueue = (frame) => {
		if (cancelled) return false;
		try {
			controller.enqueue(frame);
			return true;
		} catch {
			return false;
		}
	};
	const errorOutput = (error) => {
		if (cancelled) return;
		cancelled = true;
		try {
			controller.error(error);
		} catch {}
		for (const reader of readers) reader.cancel().catch(() => {});
	};
	async function pumpRawStream(streamId, stream) {
		const reader = stream.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) {
					enqueue(encodeEndFrame(streamId));
					return;
				}
				if (!enqueue(encodeChunkFrame(streamId, value))) return;
			}
		} catch (error) {
			enqueue(encodeErrorFrame(streamId, error));
		} finally {
			reader.releaseLock();
		}
	}
	async function pumpJSON() {
		const reader = jsonStream.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) return;
				if (!enqueue(encodeJSONFrame(value))) return;
			}
		} catch (error) {
			errorOutput(error);
			throw error;
		} finally {
			reader.releaseLock();
		}
	}
	async function pumpLateStreams() {
		if (!lateStreamSource) return [];
		const lateStreamPumps = [];
		const reader = lateStreamSource.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) break;
				lateStreamPumps.push(pumpRawStream(value.id, value.stream));
			}
		} finally {
			reader.releaseLock();
		}
		return lateStreamPumps;
	}
	return new ReadableStream({
		async start(ctrl) {
			controller = ctrl;
			const pumps = [pumpJSON()];
			for (const [streamId, stream] of rawStreams) pumps.push(pumpRawStream(streamId, stream));
			if (lateStreamSource) pumps.push(pumpLateStreams());
			try {
				const latePumps = (await Promise.all(pumps)).find(Array.isArray);
				if (latePumps && latePumps.length > 0) await Promise.all(latePumps);
				if (!cancelled) try {
					controller.close();
				} catch {}
			} catch {}
		},
		cancel() {
			cancelled = true;
			for (const reader of readers) reader.cancel().catch(() => {});
			readers.length = 0;
		}
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/server-functions-handler.js
var serovalPlugins = void 0;
var FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
var MAX_PAYLOAD_SIZE = 1e6;
var handleServerAction = async ({ request, context, serverFnId }) => {
	const methodUpper = request.method.toUpperCase();
	const url = new URL(request.url);
	const action = await getServerFnById(serverFnId, { origin: "client" });
	if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
		status: 405,
		headers: { Allow: action.method }
	});
	const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
	if (!serovalPlugins) serovalPlugins = getDefaultSerovalPlugins();
	const contentType = request.headers.get("Content-Type");
	function parsePayload(payload) {
		return fromJSON(payload, { plugins: serovalPlugins });
	}
	return await (async () => {
		try {
			let res = await (async () => {
				if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
					if (methodUpper === "GET") invariant();
					const formData = await request.formData();
					const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
					formData.delete(TSS_FORMDATA_CONTEXT);
					const params = {
						context,
						data: formData,
						method: methodUpper
					};
					if (typeof serializedContext === "string") try {
						const deserializedContext = fromJSON(JSON.parse(serializedContext), { plugins: serovalPlugins });
						if (typeof deserializedContext === "object" && deserializedContext) params.context = safeObjectMerge(deserializedContext, context);
					} catch (e) {}
					return await action(params);
				}
				if (methodUpper === "GET") {
					const payloadParam = url.searchParams.get("payload");
					if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
					const payload = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
					payload.context = safeObjectMerge(payload.context, context);
					payload.method = methodUpper;
					return await action(payload);
				}
				let jsonPayload;
				if (contentType?.includes("application/json")) jsonPayload = await request.json();
				const payload = jsonPayload ? parsePayload(jsonPayload) : {};
				payload.context = safeObjectMerge(payload.context, context);
				payload.method = methodUpper;
				return await action(payload);
			})();
			const unwrapped = res.result || res.error;
			if (isNotFound(res)) res = isNotFoundResponse(res);
			if (!isServerFn) return unwrapped;
			if (unwrapped instanceof Response) {
				if (isRedirect(unwrapped)) return unwrapped;
				unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
				return unwrapped;
			}
			return serializeResult(res);
			function serializeResult(res) {
				let nonStreamingBody = void 0;
				const alsResponse = getResponse();
				if (res !== void 0) {
					const rawStreams = /* @__PURE__ */ new Map();
					let initialPhase = true;
					let lateStreamWriter;
					let lateStreamReadable = void 0;
					const pendingLateStreams = [];
					const plugins = [/* @__PURE__ */ createRawStreamRPCPlugin((id, stream) => {
						if (initialPhase) {
							rawStreams.set(id, stream);
							return;
						}
						if (lateStreamWriter) {
							lateStreamWriter.write({
								id,
								stream
							}).catch(() => {});
							return;
						}
						pendingLateStreams.push({
							id,
							stream
						});
					}), ...serovalPlugins || []];
					let done = false;
					const callbacks = {
						onParse: (value) => {
							nonStreamingBody = value;
						},
						onDone: () => {
							done = true;
						},
						onError: (error) => {
							throw error;
						}
					};
					toCrossJSONStream(res, {
						refs: /* @__PURE__ */ new Map(),
						plugins,
						onParse(value) {
							callbacks.onParse(value);
						},
						onDone() {
							callbacks.onDone();
						},
						onError: (error) => {
							callbacks.onError(error);
						}
					});
					initialPhase = false;
					if (done && rawStreams.size === 0) return new Response(nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0, {
						status: alsResponse.status,
						statusText: alsResponse.statusText,
						headers: {
							"Content-Type": "application/json",
							[X_TSS_SERIALIZED]: "true"
						}
					});
					const { readable, writable } = new TransformStream();
					lateStreamReadable = readable;
					lateStreamWriter = writable.getWriter();
					for (const registration of pendingLateStreams) lateStreamWriter.write(registration).catch(() => {});
					pendingLateStreams.length = 0;
					const multiplexedStream = createMultiplexedStream(new ReadableStream({
						start(controller) {
							callbacks.onParse = (value) => {
								controller.enqueue(JSON.stringify(value) + "\n");
							};
							callbacks.onDone = () => {
								try {
									controller.close();
								} catch {}
								lateStreamWriter?.close().catch(() => {}).finally(() => {
									lateStreamWriter = void 0;
								});
							};
							callbacks.onError = (error) => {
								controller.error(error);
								lateStreamWriter?.abort(error).catch(() => {}).finally(() => {
									lateStreamWriter = void 0;
								});
							};
							if (nonStreamingBody !== void 0) callbacks.onParse(nonStreamingBody);
							if (done) callbacks.onDone();
						},
						cancel() {
							lateStreamWriter?.abort().catch(() => {});
							lateStreamWriter = void 0;
						}
					}), rawStreams, lateStreamReadable);
					return new Response(multiplexedStream, {
						status: alsResponse.status,
						statusText: alsResponse.statusText,
						headers: {
							"Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
							[X_TSS_SERIALIZED]: "true"
						}
					});
				}
				return new Response(void 0, {
					status: alsResponse.status,
					statusText: alsResponse.statusText
				});
			}
		} catch (error) {
			if (error instanceof Response) return error;
			if (isNotFound(error)) return isNotFoundResponse(error);
			console.info();
			console.info("Server Fn Error!");
			console.info();
			console.error(error);
			console.info();
			const serializedError = JSON.stringify(await Promise.resolve(toCrossJSONAsync(error, {
				refs: /* @__PURE__ */ new Map(),
				plugins: serovalPlugins
			})));
			const response = getResponse();
			return new Response(serializedError, {
				status: response.status ?? 500,
				statusText: response.statusText,
				headers: {
					"Content-Type": "application/json",
					[X_TSS_SERIALIZED]: "true"
				}
			});
		}
	})();
};
function isNotFoundResponse(error) {
	const { headers, ...rest } = error;
	return new Response(JSON.stringify(rest), {
		status: 404,
		headers: {
			"Content-Type": "application/json",
			...headers || {}
		}
	});
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/early-hints.js
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
	"fetch",
	"font",
	"image",
	"script",
	"style",
	"track"
]);
function buildLinkParam(name, value) {
	if (value === void 0) return name;
	if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
	return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
	const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
	if (hint.as) parts.push(buildLinkParam("as", hint.as));
	if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
	if (hint.type) parts.push(buildLinkParam("type", hint.type));
	if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
	if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
	if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
	return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
	const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
	return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
	const as = getStringAttr(attrs, "as");
	return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
	const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
	const type = getStringAttr(attrs, "type");
	const integrity = getStringAttr(attrs, "integrity");
	const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
	const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
	if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
	if (type) hint.type = type;
	if (integrity) hint.integrity = integrity;
	if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
	if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
	const href = getStringAttr(attrs, "href");
	const rel = getStringAttr(attrs, "rel");
	if (!href || !rel) return void 0;
	const relTokens = rel.split(/\s+/);
	let hintRel;
	let hintAs;
	if (relTokens.includes("modulepreload")) {
		hintRel = "modulepreload";
		hintAs = "script";
	} else if (relTokens.includes("stylesheet")) {
		hintRel = "preload";
		hintAs = "style";
	} else if (relTokens.includes("preload")) {
		hintAs = getPreloadAs(attrs);
		if (!hintAs) return void 0;
		hintRel = "preload";
	} else if (relTokens.includes("preconnect")) {
		hintRel = "preconnect";
		hintAs = void 0;
	} else if (relTokens.includes("dns-prefetch")) {
		hintRel = "dns-prefetch";
		hintAs = void 0;
	}
	if (!hintRel) return void 0;
	const hint = {
		href,
		rel: hintRel
	};
	if (hintAs) hint.as = hintAs;
	addEarlyHintFetchAttrs(hint, attrs);
	return hint;
}
function collectStaticHintsFromManifest(manifest, matchedRoutes) {
	const hints = [];
	for (const route of matchedRoutes) {
		const routeManifest = manifest.routes[route.id];
		if (!routeManifest) continue;
		for (const link of routeManifest.preloads ?? []) {
			const attrs = getScriptPreloadAttrs(manifest, link);
			const hint = {
				href: attrs.href,
				rel: attrs.rel,
				as: "script"
			};
			if (attrs.crossOrigin !== void 0) hint.crossOrigin = attrs.crossOrigin;
			hints.push(hint);
		}
		for (const link of routeManifest.css ?? []) {
			const stylesheetHref = getStylesheetHref(link);
			if (manifest.inlineCss?.styles[stylesheetHref] !== void 0) continue;
			const resolvedLink = resolveManifestCssLink(link);
			const hint = {
				href: stylesheetHref,
				rel: "preload",
				as: "style"
			};
			if (resolvedLink.crossOrigin !== void 0) hint.crossOrigin = resolvedLink.crossOrigin;
			hints.push(hint);
		}
	}
	return hints;
}
function collectDynamicHintsFromMatches(matches) {
	const hints = [];
	for (const match of matches) {
		const links = match.links;
		if (!Array.isArray(links)) continue;
		for (const link of links) {
			const hint = linkAttrsToEarlyHint(link);
			if (hint) hints.push(hint);
		}
	}
	return hints;
}
function createEarlyHintsEvent(opts) {
	const nextHints = [];
	const nextLinks = [];
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.sentHints.push(hint);
		nextHints.push(hint);
		nextLinks.push(link);
	}
	if (!nextHints.length && opts.phase !== "dynamic") return void 0;
	return {
		phase: opts.phase,
		hints: nextHints,
		links: nextLinks,
		allHints: opts.sentHints.slice(),
		allLinks: Array.from(opts.sentLinks)
	};
}
function createResponseLinkHeaderEntries(opts) {
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.entries.push({
			phase: opts.phase,
			hint,
			link
		});
	}
}
function getResponseLinkHeaderEntries(opts) {
	if (!opts.filter) return opts.entries.map((entry) => entry.link);
	try {
		const links = [];
		for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
		return links;
	} catch (err) {
		console.error("Error filtering response Link headers:", err);
		return [];
	}
}
function notifyEarlyHints(phase, event, onEarlyHints) {
	try {
		const result = onEarlyHints(event);
		if (result) Promise.resolve(result).catch((err) => {
			console.error(`Error sending ${phase} early hints:`, err);
		});
	} catch (err) {
		console.error(`Error sending ${phase} early hints:`, err);
	}
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
	if (typeof responseLinkHeader !== "object") return;
	return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
	for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
	for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
		phase: opts.phase,
		hint: opts.event.hints[index],
		link: opts.event.links[index]
	});
}
function collectEarlyHintsPhase(opts) {
	const event = opts.onEarlyHints ? createEarlyHintsEvent({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		sentHints: opts.sentHints
	}) : void 0;
	if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
	if (!opts.responseLinkHeaderEntries) return;
	if (event) {
		collectResponseLinkHeaderEntries({
			phase: opts.phase,
			event,
			entries: opts.responseLinkHeaderEntries
		});
		return;
	}
	createResponseLinkHeaderEntries({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		entries: opts.responseLinkHeaderEntries
	});
}
function createEarlyHintsCollector(opts) {
	if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
	const sentLinks = /* @__PURE__ */ new Set();
	const sentHints = opts.onEarlyHints ? new Array() : void 0;
	const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
	const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
	return {
		collectStatic: ({ manifest, matchedRoutes }) => {
			if (!matchedRoutes?.length) return;
			collectEarlyHintsPhase({
				phase: "static",
				hints: collectStaticHintsFromManifest(manifest, matchedRoutes),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		collectDynamic: (matches) => {
			collectEarlyHintsPhase({
				phase: "dynamic",
				hints: collectDynamicHintsFromMatches(matches),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		appendResponseHeaders: (headers) => {
			if (!responseLinkHeaderEntries?.length) return;
			appendResponseLinkHeaders({
				responseHeaders: headers,
				entries: responseLinkHeaderEntries,
				filter: responseLinkHeaderFilter
			});
		}
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/transformAssetUrls.js
function normalizeTransformAssetResult(result) {
	if (typeof result === "string") return { href: result };
	return result;
}
function escapeCssString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
	const { strings, urls } = options.template;
	if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
	let css = strings[0];
	for (let index = 0; index < urls.length; index++) {
		const transformed = normalizeTransformAssetResult(await options.transformFn({
			kind: "css-url",
			url: urls[index],
			stylesheetHref: options.stylesheetHref
		}));
		css += escapeCssString(transformed.href) + strings[index + 1];
	}
	return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
	const transformedStyles = {};
	const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
		const template = inlineCss.templates?.[stylesheetHref];
		return [stylesheetHref, template ? await transformInlineCssTemplate({
			stylesheetHref,
			template,
			transformFn
		}) : css];
	}));
	for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
	return {
		styles: transformedStyles,
		...inlineCss.templates ? { templates: inlineCss.templates } : {}
	};
}
function resolveTransformAssetsCrossOrigin(config, kind) {
	if (!config) return void 0;
	if (typeof config === "string") return config;
	return config[kind];
}
function isObjectShorthand(transform) {
	return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
	if (typeof transform === "string") {
		const prefix = transform;
		return {
			type: "transform",
			transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
			cache: true
		};
	}
	if (typeof transform === "function") return {
		type: "transform",
		transformFn: transform,
		cache: true
	};
	if (isObjectShorthand(transform)) {
		const { prefix, crossOrigin } = transform;
		return {
			type: "transform",
			transformFn: ({ url, kind }) => {
				const href = `${prefix}${url}`;
				if (kind === "css-url") return { href };
				const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
				return co ? {
					href,
					crossOrigin: co
				} : { href };
			},
			cache: true
		};
	}
	if ("createTransform" in transform && transform.createTransform) return {
		type: "createTransform",
		createTransform: transform.createTransform,
		cache: transform.cache !== false
	};
	return {
		type: "transform",
		transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
		cache: transform.cache !== false
	};
}
function assignManifestLink(link, next) {
	if (typeof link === "string") return next.crossOrigin ? next : next.href;
	const nextLink = {
		...link,
		href: next.href
	};
	if (next.crossOrigin) nextLink.crossOrigin = next.crossOrigin;
	else delete nextLink.crossOrigin;
	return nextLink;
}
async function transformManifestAssets(source, transformFn, _opts) {
	const manifest = structuredClone(source);
	const inlineCssEnabled = _opts?.inlineCss !== false;
	const scriptTransforms = /* @__PURE__ */ new Map();
	const transformScript = (url) => {
		const cached = scriptTransforms.get(url);
		if (cached) return cached;
		const transformed = Promise.resolve(transformFn({
			url,
			kind: "script"
		})).then(normalizeTransformAssetResult);
		scriptTransforms.set(url, transformed);
		return transformed;
	};
	if (!inlineCssEnabled) delete manifest.inlineCss;
	else if (manifest.inlineCss) manifest.inlineCss = await transformInlineCssStyles(manifest.inlineCss, transformFn);
	for (const route of Object.values(manifest.routes)) {
		if (route.preloads?.length) route.preloads = await Promise.all(route.preloads.map(async (link) => {
			const result = await transformScript(resolveManifestAssetLink(link).href);
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.css?.length && !manifest.inlineCss) route.css = await Promise.all(route.css.map(async (link) => {
			const result = normalizeTransformAssetResult(await transformFn({
				url: resolveManifestCssLink(link).href,
				kind: "stylesheet"
			}));
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.scripts?.length) for (const script of route.scripts) {
			const src = script.attrs?.src;
			if (typeof src !== "string") continue;
			const result = await transformScript(src);
			script.attrs = {
				...script.attrs,
				src: result.href
			};
			if (result.crossOrigin) script.attrs.crossOrigin = result.crossOrigin;
			else delete script.attrs.crossOrigin;
		}
	}
	return manifest;
}
/**
* Builds a final ServerManifest without URL transforms. Used when no
* transformAssets option is provided.
*
* Returns a new manifest object so the cached base manifest is never mutated.
*/
function buildManifest(source, opts) {
	return {
		...source.scriptFormat ? { scriptFormat: source.scriptFormat } : {},
		...opts?.inlineCss !== false && source.inlineCss ? { inlineCss: structuredClone(source.inlineCss) } : {},
		routes: { ...source.routes }
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/inlineCss.js
function getStaticHandlerInlineCssDefault(handlerInlineCss) {
	if (typeof handlerInlineCss === "function") return;
	return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
	if (opts.requestInlineCss !== void 0) return opts.requestInlineCss;
	if (typeof opts.handlerInlineCss === "function") return await opts.handlerInlineCss({ request: opts.request });
	return opts.handlerInlineCss ?? true;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/finalManifest.js
function createCachedBaseManifestLoader(loadBaseManifest) {
	let baseManifestPromise;
	return () => {
		if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
			baseManifestPromise = void 0;
			throw error;
		});
		return baseManifestPromise;
	};
}
function createFinalManifestTransformResolver(transformAssets, opts) {
	const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
	const cache = transformConfig ? transformConfig.cache : true;
	const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
	let cachedCreateTransformPromise;
	const clearCachedCreateTransform = () => {
		cachedCreateTransformPromise = void 0;
	};
	return {
		cache,
		warmup,
		clearCachedCreateTransform,
		getTransformFn: async (ctx) => {
			if (!transformConfig) return void 0;
			if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
			if (!cache || !opts.cacheCreateTransform) return transformConfig.createTransform(ctx);
			if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
				clearCachedCreateTransform();
				throw error;
			});
			return cachedCreateTransformPromise;
		}
	};
}
function createFinalManifestResolver(opts) {
	const finalManifestCache = /* @__PURE__ */ new Map();
	const transformResolver = createFinalManifestTransformResolver(opts.transformAssets, { cacheCreateTransform: opts.cacheCreateTransform });
	const handlerDefaultInlineCss = getStaticHandlerInlineCssDefault(opts.inlineCss);
	const getRequestManifestOptions = async (requestOpts) => {
		const transformFn = await transformResolver.getTransformFn({
			warmup: false,
			request: requestOpts.request
		});
		const inlineCss = await resolveInlineCssForRequest({
			request: requestOpts.request,
			handlerInlineCss: opts.inlineCss,
			requestInlineCss: requestOpts.requestInlineCss
		});
		return {
			getBaseManifest: requestOpts.getBaseManifest,
			transformFn,
			cache: transformResolver.cache,
			inlineCss
		};
	};
	const resolveRequest = async (requestOpts, cache) => {
		return resolveFinalManifest({
			...await getRequestManifestOptions(requestOpts),
			finalManifestCache: cache
		});
	};
	return {
		warmup: ({ getBaseManifest }) => warmupFinalManifest({
			enabled: transformResolver.warmup,
			handlerDefaultInlineCss,
			cache: transformResolver.cache,
			finalManifestCache,
			getBaseManifest,
			getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
			onError: transformResolver.clearCachedCreateTransform
		}),
		resolveCached: (requestOpts) => resolveRequest(requestOpts, finalManifestCache),
		resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
	};
}
function getFinalManifestCacheKey(inlineCss) {
	return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, promise) {
	const cachedFinalManifestPromise = promise.catch((error) => {
		if (cachedFinalManifestPromises.get(cacheKey) === cachedFinalManifestPromise) cachedFinalManifestPromises.delete(cacheKey);
		throw error;
	});
	cachedFinalManifestPromises.set(cacheKey, cachedFinalManifestPromise);
	return cachedFinalManifestPromise;
}
function getOrCreateCachedFinalManifestPromise(cachedFinalManifestPromises, cacheKey, computeFinalManifest) {
	const cachedFinalManifestPromise = cachedFinalManifestPromises.get(cacheKey);
	if (cachedFinalManifestPromise) return cachedFinalManifestPromise;
	return cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
	return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifest(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
	const computeFinalManifest = async () => {
		return buildFinalManifest({
			base: await opts.getBaseManifest(),
			transformFn: opts.transformFn,
			inlineCss: opts.inlineCss
		});
	};
	if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
	return computeFinalManifest();
}
function warmupFinalManifest(opts) {
	if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
	const inlineCss = opts.handlerDefaultInlineCss;
	const warmupPromise = getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), async () => {
		const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
		return buildFinalManifest({
			base,
			transformFn,
			inlineCss
		});
	});
	if (opts.onError) warmupPromise.catch(opts.onError);
	return warmupPromise;
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/serializer/ServerFunctionSerializationAdapter.js
var ServerFunctionSerializationAdapter = createSerializationAdapter({
	key: "$TSS/serverfn",
	test: (v) => {
		if (typeof v !== "function") return false;
		if (!(TSS_SERVER_FUNCTION in v)) return false;
		return !!v[TSS_SERVER_FUNCTION];
	},
	toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
	fromSerializable: ({ functionId }) => {
		const fn = async (opts, signal) => {
			return (await (await getServerFnById(functionId, { origin: "client" }))(opts ?? {}, signal)).result;
		};
		return fn;
	}
});
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/ssr/tsrScript.js
var tsrScript_default = "self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]}";
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/ssr/ssr-server.js
var SCOPE_ID = "tsr";
var TSR_PREFIX = GLOBAL_TSR + ".router=";
var P_PREFIX = GLOBAL_TSR + ".p(()=>";
var P_SUFFIX = ")";
function dehydrateMatch(match) {
	const dehydratedMatch = {
		i: dehydrateSsrMatchId(match.id),
		u: match.updatedAt,
		s: match.status
	};
	for (const [key, shorthand] of [
		["__beforeLoadContext", "b"],
		["loaderData", "l"],
		["error", "e"],
		["ssr", "ssr"]
	]) if (match[key] !== void 0) dehydratedMatch[shorthand] = match[key];
	if (match.globalNotFound) dehydratedMatch.g = true;
	return dehydratedMatch;
}
var INITIAL_SCRIPTS = [getCrossReferenceHeader(SCOPE_ID), tsrScript_default];
var ScriptBuffer = class {
	constructor(injectScript) {
		this._scriptBarrierLifted = false;
		this._cleanedUp = false;
		this._microtaskVersion = 0;
		this._pendingMicrotaskVersion = 0;
		this.injectScript = injectScript;
		this._queue = INITIAL_SCRIPTS.slice();
	}
	enqueue(script) {
		if (this._cleanedUp) return;
		this._queue.push(script);
		if (this._scriptBarrierLifted) this.scheduleInjectBufferedScripts();
	}
	liftBarrier() {
		if (this._scriptBarrierLifted || this._cleanedUp) return;
		this._scriptBarrierLifted = true;
		if (this._queue.length > 0) this.scheduleInjectBufferedScripts();
	}
	scheduleInjectBufferedScripts() {
		if (this._pendingMicrotaskVersion !== 0) return;
		const pendingVersion = ++this._microtaskVersion;
		this._pendingMicrotaskVersion = pendingVersion;
		queueMicrotask(() => {
			if (this._pendingMicrotaskVersion !== pendingVersion) return;
			this._pendingMicrotaskVersion = 0;
			this.injectBufferedScripts();
		});
	}
	clearPendingMicrotask() {
		if (this._pendingMicrotaskVersion === 0) return;
		this._pendingMicrotaskVersion = 0;
		this._microtaskVersion++;
	}
	/**
	* Flushes any pending scripts synchronously.
	* Call this before signaling serialization finished to ensure all scripts are injected.
	*
	* IMPORTANT: Only injects if the barrier has been lifted. Before the barrier is lifted,
	* scripts should remain in the queue so takeBufferedScripts() can retrieve them
	*/
	flush() {
		if (!this._scriptBarrierLifted) return;
		if (this._cleanedUp) return;
		this.clearPendingMicrotask();
		this.injectBufferedScripts();
	}
	takeAll() {
		return this.takeScripts(this._queue.length);
	}
	takeScripts(count) {
		if (count <= 0) return void 0;
		const bufferedScripts = this._queue.splice(0, count);
		if (bufferedScripts.length === 0) return;
		if (bufferedScripts.length === 1) return bufferedScripts[0] + ";document.currentScript.remove()";
		return bufferedScripts.join(";") + ";document.currentScript.remove()";
	}
	hasPending() {
		return this._queue.length > 0;
	}
	injectBufferedScripts() {
		if (this._cleanedUp) return;
		if (this._queue.length === 0) return;
		const scriptsToInject = this.takeAll();
		if (scriptsToInject) this.injectScript?.(scriptsToInject);
	}
	cleanup() {
		this._cleanedUp = true;
		this.clearPendingMicrotask();
		this._queue = [];
		this.injectScript = void 0;
	}
};
var MANIFEST_CACHE_SIZE = 100;
var manifestCaches = /* @__PURE__ */ new WeakMap();
function getManifestCache(manifest) {
	const cache = manifestCaches.get(manifest);
	if (cache) return cache;
	const newCache = createLRUCache(MANIFEST_CACHE_SIZE);
	manifestCaches.set(manifest, newCache);
	return newCache;
}
function getInlineCssForPreparedRoutes(manifest, preparedRoutes) {
	if (preparedRoutes.inlineCss !== void 0) return preparedRoutes.inlineCss;
	const styles = manifest.inlineCss?.styles;
	const hrefs = preparedRoutes.inlineCssHrefs;
	if (!styles || !hrefs?.length) return void 0;
	let css = "";
	for (const href of hrefs) css += styles[href];
	preparedRoutes.inlineCss = css;
	return css;
}
function getInlineCssAssetForPreparedRoutes(manifest, preparedRoutes) {
	const css = getInlineCssForPreparedRoutes(manifest, preparedRoutes);
	return css === void 0 ? void 0 : createInlineCssStyleAsset(css);
}
function getMatchedRoutesCacheKey(matches) {
	let cacheKey = "";
	for (let i = 0; i < matches.length; i++) cacheKey += (i === 0 ? "" : "\0") + matches[i].routeId;
	return cacheKey;
}
function getPreparedMatchedManifestRoutes(manifest, matches, cacheKey) {
	{
		const cached = getManifestCache(manifest).get(cacheKey);
		if (cached) return cached;
	}
	const preparedRoutes = prepareMatchedManifestRoutes(manifest, matches);
	getManifestCache(manifest).set(cacheKey, preparedRoutes);
	return preparedRoutes;
}
function prepareMatchedManifestRoutes(manifest, matches) {
	const inlineStyles = manifest.inlineCss?.styles;
	const routes = {};
	if (!inlineStyles) {
		for (const match of matches) {
			const route = manifest.routes[match.routeId];
			if (route) routes[match.routeId] = route;
		}
		return {
			routes,
			hasStrippedRoutes: false
		};
	}
	const inlineCssHrefs = [];
	const seenInlineCssHrefs = /* @__PURE__ */ new Set();
	let hasStrippedRoutes = false;
	for (const match of matches) {
		const routeId = match.routeId;
		const route = manifest.routes[routeId];
		if (!route) continue;
		const nextRoute = stripInlinedStylesheetAssetsFromRoute(inlineStyles, route, inlineCssHrefs, seenInlineCssHrefs);
		if (nextRoute !== route) hasStrippedRoutes = true;
		routes[routeId] = nextRoute;
	}
	return {
		routes,
		hasStrippedRoutes,
		...inlineCssHrefs.length ? { inlineCssHrefs } : {}
	};
}
function stripInlinedStylesheetAssetsFromRoute(inlineStyles, route, inlineCssHrefs, seenInlineCssHrefs) {
	const css = route.css;
	if (!css) return route;
	if (css.length === 0) {
		const nextRoute = { ...route };
		delete nextRoute.css;
		return nextRoute;
	}
	let cssLinks;
	for (let i = 0; i < css.length; i++) {
		const link = css[i];
		const href = getStylesheetHref(link);
		if (inlineStyles[href] === void 0) {
			if (cssLinks) cssLinks.push(link);
			continue;
		}
		if (!seenInlineCssHrefs.has(href)) {
			seenInlineCssHrefs.add(href);
			inlineCssHrefs.push(href);
		}
		if (!cssLinks) cssLinks = css.slice(0, i);
	}
	if (!cssLinks) return route;
	if (cssLinks.length > 0) return {
		...route,
		css: cssLinks
	};
	const nextRoute = { ...route };
	delete nextRoute.css;
	return nextRoute;
}
function hasRouteAssets(route) {
	return !!route.scripts?.length || !!route.css?.length;
}
function hasRequestAssets(assets) {
	return !!assets && (!!assets.preloads?.length || hasRouteAssets(assets));
}
function mergeRequestAssetsIntoRootRoute(rootRoute, requestAssets) {
	const preloads = requestAssets?.preloads?.length ? [...requestAssets.preloads, ...rootRoute?.preloads ?? []] : rootRoute?.preloads;
	const scripts = requestAssets?.scripts?.length ? [...requestAssets.scripts, ...rootRoute?.scripts ?? []] : rootRoute?.scripts;
	const cssLinks = requestAssets?.css?.length ? [...requestAssets.css, ...rootRoute?.css ?? []] : rootRoute?.css;
	return {
		...rootRoute ?? {},
		...preloads?.length ? { preloads } : {},
		...scripts?.length ? { scripts } : {},
		...cssLinks?.length ? { css: cssLinks } : {}
	};
}
function attachRouterServerSsrUtils({ router, manifest, getRequestAssets }) {
	router.ssr = { get manifest() {
		if (!manifest) return manifest;
		const requestAssets = getRequestAssets?.();
		const matches = router.stores.matches.get();
		const hasAssets = hasRequestAssets(requestAssets);
		if (!hasAssets && !manifest.inlineCss) return manifest;
		let inlineCssAsset;
		let routes = manifest.routes;
		if (manifest.inlineCss) {
			const preparedManifest = getPreparedMatchedManifestRoutes(manifest, matches, getMatchedRoutesCacheKey(matches));
			inlineCssAsset = getInlineCssAssetForPreparedRoutes(manifest, preparedManifest);
			if (preparedManifest.hasStrippedRoutes) routes = {
				...manifest.routes,
				...preparedManifest.routes
			};
		}
		if (!hasAssets) return {
			...manifest.scriptFormat ? { scriptFormat: manifest.scriptFormat } : {},
			...inlineCssAsset ? { inlineStyle: inlineCssAsset } : {},
			routes
		};
		const rootRoute = routes[rootRouteId];
		return {
			...manifest.scriptFormat ? { scriptFormat: manifest.scriptFormat } : {},
			...inlineCssAsset ? { inlineStyle: inlineCssAsset } : {},
			routes: {
				...routes,
				[rootRouteId]: mergeRequestAssetsIntoRootRoute(rootRoute, requestAssets)
			}
		};
	} };
	let _dehydrated = false;
	let _serializationFinished = false;
	let streamFastPathReserved = false;
	const renderFinishedListeners = [];
	const injectedHtmlListeners = [];
	const serializationFinishedListeners = [];
	const cleanupListeners = [];
	let cleanupStarted = false;
	let injectedHtmlBuffer = "";
	const callListeners = (listeners, errorPrefix) => {
		const snapshot = listeners.slice();
		for (const l of snapshot) try {
			l();
		} catch (err) {
			console.error(`${errorPrefix}:`, err);
		}
	};
	const removeListener = (listeners, listener) => {
		const index = listeners.indexOf(listener);
		if (index >= 0) listeners.splice(index, 1);
	};
	const scriptBuffer = new ScriptBuffer((script) => {
		serverSsr.injectScript(script);
	});
	const serverSsr = {
		injectHtml: (html) => {
			if (!html || cleanupStarted) return;
			injectedHtmlBuffer += html;
			callListeners(injectedHtmlListeners, "SSR injected HTML listener error");
		},
		injectScript: (script) => {
			if (!script || cleanupStarted) return;
			const html = `<script${router.options.ssr?.nonce ? ` nonce='${router.options.ssr.nonce}'` : ""}>${script}<\/script>`;
			serverSsr.injectHtml(html);
		},
		dehydrate: async (opts) => {
			if (_dehydrated) invariant();
			let matchesToDehydrate = router.stores.matches.get();
			if (router.isShell()) matchesToDehydrate = matchesToDehydrate.slice(0, 1);
			const matches = matchesToDehydrate.map(dehydrateMatch);
			let manifestToDehydrate = void 0;
			if (manifest) {
				const cacheKey = getMatchedRoutesCacheKey(matchesToDehydrate);
				const preparedManifest = getPreparedMatchedManifestRoutes(manifest, matchesToDehydrate, cacheKey);
				manifestToDehydrate = {
					...manifest.scriptFormat ? { scriptFormat: manifest.scriptFormat } : {},
					...preparedManifest.inlineCssHrefs ? { inlineStyle: createInlineCssPlaceholderAsset() } : {},
					routes: preparedManifest.routes
				};
				const requestAssets = opts?.requestAssets;
				if (hasRequestAssets(requestAssets)) {
					const existingRoot = manifestToDehydrate.routes[rootRouteId];
					manifestToDehydrate.routes = {
						...manifestToDehydrate.routes,
						[rootRouteId]: mergeRequestAssetsIntoRootRoute(existingRoot, requestAssets)
					};
				}
			}
			const dehydratedRouter = {
				manifest: manifestToDehydrate,
				matches
			};
			const lastMatchId = matchesToDehydrate[matchesToDehydrate.length - 1]?.id;
			if (lastMatchId) dehydratedRouter.lastMatchId = dehydrateSsrMatchId(lastMatchId);
			const dehydratedData = await router.options.dehydrate?.();
			if (dehydratedData) dehydratedRouter.dehydratedData = dehydratedData;
			_dehydrated = true;
			const trackPlugins = { didRun: false };
			const serializationAdapters = router.options.serializationAdapters;
			const plugins = serializationAdapters ? serializationAdapters.map((t) => /* @__PURE__ */ makeSsrSerovalPlugin(t, trackPlugins)).concat(defaultSerovalPlugins) : defaultSerovalPlugins;
			let serializationCompleteSignaled = false;
			const signalSerializationComplete = () => {
				if (serializationCompleteSignaled || cleanupStarted) return;
				serializationCompleteSignaled = true;
				_serializationFinished = true;
				const listeners = serializationFinishedListeners.slice();
				serializationFinishedListeners.length = 0;
				for (const l of listeners) try {
					l();
				} catch (err) {
					console.error("Serialization listener error:", err);
				}
			};
			const finishScriptSerialization = () => {
				if (serializationCompleteSignaled || cleanupStarted) return;
				scriptBuffer.enqueue(GLOBAL_TSR + ".e()");
				scriptBuffer.flush();
				signalSerializationComplete();
			};
			crossSerializeStream(dehydratedRouter, {
				refs: /* @__PURE__ */ new Map(),
				plugins,
				onSerialize: (data, initial) => {
					let serialized = initial ? TSR_PREFIX + data : data;
					if (trackPlugins.didRun) serialized = P_PREFIX + serialized + P_SUFFIX;
					scriptBuffer.enqueue(serialized);
				},
				onError: (err) => {
					console.error("Serialization error:", err);
					if (err && err.stack) console.error(err.stack);
					finishScriptSerialization();
				},
				scopeId: SCOPE_ID,
				onDone: () => {
					finishScriptSerialization();
				}
			});
		},
		isDehydrated() {
			return _dehydrated;
		},
		isSerializationFinished() {
			return _serializationFinished;
		},
		reserveStreamFastPath() {
			if (!cleanupStarted && _serializationFinished && !streamFastPathReserved && renderFinishedListeners.length === 0 && !injectedHtmlBuffer && !scriptBuffer.hasPending()) {
				streamFastPathReserved = true;
				return true;
			}
			return false;
		},
		onInjectedHtml: (listener) => {
			if (cleanupStarted) return () => {};
			injectedHtmlListeners.push(listener);
			return () => removeListener(injectedHtmlListeners, listener);
		},
		onRenderFinished: (listener) => {
			if (cleanupStarted || streamFastPathReserved) return;
			renderFinishedListeners.push(listener);
		},
		onSerializationFinished: (listener) => {
			if (cleanupStarted) return () => {};
			if (_serializationFinished && !cleanupStarted) {
				try {
					listener();
				} catch (err) {
					console.error("Serialization listener error:", err);
				}
				return () => {};
			}
			serializationFinishedListeners.push(listener);
			return () => removeListener(serializationFinishedListeners, listener);
		},
		onCleanup: (listener) => {
			if (cleanupStarted) return;
			cleanupListeners.push(listener);
		},
		setRenderFinished: () => {
			if (cleanupStarted) return;
			scriptBuffer.liftBarrier();
			const listeners = renderFinishedListeners.slice();
			renderFinishedListeners.length = 0;
			for (const l of listeners) try {
				l();
			} catch (err) {
				console.error("Error in render finished listener:", err);
			}
			if (_serializationFinished) scriptBuffer.flush();
		},
		takeBufferedScripts() {
			const scripts = scriptBuffer.takeAll();
			if (!scripts) return void 0;
			return {
				tag: "script",
				attrs: {
					nonce: router.options.ssr?.nonce,
					className: "$tsr",
					id: TSR_SCRIPT_BARRIER_ID
				},
				children: scripts
			};
		},
		liftScriptBarrier() {
			scriptBuffer.liftBarrier();
		},
		takeBufferedHtml() {
			if (!injectedHtmlBuffer) return;
			const buffered = injectedHtmlBuffer;
			injectedHtmlBuffer = "";
			return buffered;
		},
		cleanup() {
			if (cleanupStarted) return;
			cleanupStarted = true;
			const listeners = cleanupListeners.slice();
			cleanupListeners.length = 0;
			for (const l of listeners) try {
				l();
			} catch (err) {
				console.error("Error in SSR cleanup listener:", err);
			}
			renderFinishedListeners.length = 0;
			injectedHtmlListeners.length = 0;
			serializationFinishedListeners.length = 0;
			injectedHtmlBuffer = "";
			scriptBuffer.cleanup();
			router.serverSsr = void 0;
		}
	};
	router.serverSsr = serverSsr;
	for (const listener of router.serverSsrLifecycle?.onServerSsrAttach ?? []) try {
		listener(serverSsr);
	} catch (err) {
		console.error("SSR attach listener error:", err);
	}
}
/**
* Get the origin for the request.
*
* SECURITY: We intentionally do NOT trust the Origin header for determining
* the router's origin. The Origin header can be spoofed by attackers, which
* could lead to SSRF-like vulnerabilities where redirects are constructed
* using a malicious origin (CVE-2024-34351).
*
* Instead, we derive the origin from request.url, which is typically set by
* the server infrastructure (not client-controlled headers).
*
* For applications behind proxies that need to trust forwarded headers,
* use the router's `origin` option to explicitly configure a trusted origin.
*/
function getOrigin(request) {
	try {
		return new URL(request.url).origin;
	} catch {}
	return "http://localhost";
}
function getNormalizedURL(url, base) {
	if (typeof url === "string") url = url.replace("\\", "%5C");
	const rawUrl = new URL(url, base);
	const { path: decodedPathname, handledProtocolRelativeURL } = decodePath(rawUrl.pathname);
	const searchParams = new URLSearchParams(rawUrl.search);
	const normalizedHref = decodedPathname + (searchParams.size > 0 ? "?" : "") + searchParams.toString() + rawUrl.hash;
	return {
		url: new URL(normalizedHref, rawUrl.origin),
		handledProtocolRelativeURL
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+router-core@1.171.15/node_modules/@tanstack/router-core/dist/esm/ssr/handlerCallback.js
function isSsrResponse(value) {
	return typeof value === "object" && value !== null && "response" in value && "serverSsrCleanup" in value;
}
function normalizeSsrResponse(result) {
	return isSsrResponse(result) ? result : {
		response: result,
		serverSsrCleanup: "none"
	};
}
async function replaceSsrResponse(result, response, reason) {
	const ssrResponse = normalizeSsrResponse(result);
	if (ssrResponse.serverSsrCleanup === "stream") await ssrResponse.dispose(reason);
	return {
		response,
		serverSsrCleanup: "none"
	};
}
async function stripSsrResponseBody(result, reason) {
	const ssrResponse = normalizeSsrResponse(result);
	if (ssrResponse.serverSsrCleanup === "stream") await ssrResponse.dispose(reason);
	return {
		response: new Response(null, ssrResponse.response),
		serverSsrCleanup: "none"
	};
}
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/createStartHandler.js
function getStartResponseHeaders(opts) {
	return mergeHeaders({ "Content-Type": "text/html; charset=utf-8" }, ...opts.router.stores.matches.get().map((match) => {
		return match.headers;
	}));
}
var entriesPromise;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
	const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
		import("./router-vv-xRYbe.js"),
		import("./start-CGFnDpVP.js"),
		import("./vendor-router-Dnt9P9oO.js").then((n) => n.t)
	]);
	return {
		routerEntry,
		startEntry,
		pluginAdapters
	};
}
function getEntries() {
	if (!entriesPromise) entriesPromise = loadEntries();
	return entriesPromise;
}
var ROUTER_BASEPATH = "cosmic-portfolio";
var SERVER_FN_BASE = "/cosmic-portfolio/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var IS_DEV = false;
var ERR_NO_RESPONSE = IS_DEV ? `It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.` : "Internal Server Error";
var ERR_NO_DEFER = IS_DEV ? `You cannot defer to the app router if there is no component defined on this route.` : "Internal Server Error";
function throwRouteHandlerError() {
	throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
	throw new Error(ERR_NO_DEFER);
}
/**
* Check if a value is a special response (Response or Redirect)
*/
function isSpecialResponse(value) {
	return value instanceof Response || isRedirect(value);
}
/**
* Normalize middleware result to context shape
*/
function handleCtxResult(result) {
	if (isSsrResponse(result) || isSpecialResponse(result)) return { response: result };
	return result;
}
/**
* Execute a middleware chain
*/
async function executeMiddleware(middlewares, ctx) {
	let index = -1;
	let streamResponse;
	const setResponse = (response) => {
		if (isSsrResponse(response)) {
			if (response.serverSsrCleanup === "stream") streamResponse = response;
			ctx.response = response.response;
			return;
		}
		ctx.response = response;
	};
	const disposeStreamResponse = async (reason) => {
		const response = streamResponse;
		if (!response) return;
		streamResponse = void 0;
		const currentResponse = ctx.response;
		if (currentResponse === response.response || currentResponse instanceof Response && response.response.body !== null && currentResponse.body === response.response.body) ctx.response = void 0;
		await response.dispose(reason);
	};
	const getFinalResponse = async () => {
		const response = ctx.response;
		if (!response) throwRouteHandlerError();
		if (!streamResponse) return response;
		if (response === streamResponse.response) return streamResponse;
		if (streamResponse.response.body !== null && response.body === streamResponse.response.body) return {
			...streamResponse,
			response
		};
		await disposeStreamResponse("middleware response replaced");
		return response;
	};
	const next = async (nextCtx) => {
		if (nextCtx) {
			if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
			for (const key of Object.keys(nextCtx)) if (key === "response") setResponse(nextCtx.response);
			else if (key !== "context") ctx[key] = nextCtx[key];
		}
		index++;
		const middleware = middlewares[index];
		if (!middleware) return ctx;
		let result;
		try {
			result = await middleware({
				...ctx,
				next
			});
		} catch (err) {
			if (isSpecialResponse(err)) {
				setResponse(err);
				return ctx;
			}
			await disposeStreamResponse("middleware error");
			throw err;
		}
		const normalized = handleCtxResult(result);
		if (normalized) {
			if (normalized.response !== void 0) setResponse(normalized.response);
			if (normalized.context) ctx.context = safeObjectMerge(ctx.context, normalized.context);
		}
		return ctx;
	};
	await next();
	return {
		ctx,
		response: await getFinalResponse()
	};
}
/**
* Wrap a route handler as middleware
*/
function handlerToMiddleware(handler, mayDefer = false) {
	if (mayDefer) return handler;
	return async (ctx) => {
		const response = await handler({
			...ctx,
			next: throwIfMayNotDefer
		});
		if (!response) throwRouteHandlerError();
		return response;
	};
}
/**
* Creates the TanStack Start request handler.
*
* @example Backwards-compatible usage (handler callback only):
* ```ts
* export default createStartHandler(defaultStreamHandler)
* ```
*
* @example With CDN URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: 'https://cdn.example.com',
* })
* ```
*
* @example With per-request URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: {
*     transform: ({ url }) => {
*       const cdnBase = getRequest().headers.get('x-cdn-base') || ''
*       return { href: `${cdnBase}${url}` }
*     },
*     cache: false,
*   },
* })
* ```
*/
function createStartHandler(cbOrOptions) {
	const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
	const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
	const finalManifestResolver = createFinalManifestResolver({
		...handlerOptions,
		cacheCreateTransform: true
	});
	const resolveManifestForRequest = finalManifestResolver.resolveCached;
	finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest(void 0) });
	const startRequestResolver = async (request, requestOpts) => {
		let router = null;
		let responseOwnsCleanup = false;
		try {
			const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
			const href = url.pathname + url.search + url.hash;
			const origin = getOrigin(request);
			if (handledProtocolRelativeURL) return Response.redirect(url, 308);
			const entries = await getEntries();
			const hasStartInstance = !!entries.startEntry.startInstance;
			const startOptions = await entries.startEntry.startInstance?.getOptions() || {};
			const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
			const serializationAdapters = [
				...startOptions.serializationAdapters || [],
				...hasPluginAdapters ? pluginSerializationAdapters : [],
				ServerFunctionSerializationAdapter
			];
			const requestStartOptions = {
				...startOptions,
				requestMiddleware: hasStartInstance ? startOptions.requestMiddleware : [defaultCsrfMiddleware],
				serializationAdapters
			};
			const flattenedRequestMiddlewares = requestStartOptions.requestMiddleware ? flattenMiddlewares(requestStartOptions.requestMiddleware) : [];
			const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
			const getRouter = async () => {
				if (router) return router;
				router = await entries.routerEntry.getRouter();
				let isShell = IS_SHELL_ENV;
				if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
				const history = createMemoryHistory({ initialEntries: [href] });
				router.update({
					history,
					isShell,
					isPrerendering: IS_PRERENDERING,
					origin: router.options.origin ?? origin,
					defaultSsr: requestStartOptions.defaultSsr,
					serializationAdapters: [...requestStartOptions.serializationAdapters, ...router.options.serializationAdapters || []],
					basepath: ROUTER_BASEPATH
				});
				return router;
			};
			if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
				const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
				if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
				const serverFnHandler = async ({ context }) => {
					return runWithStartContext({
						getRouter,
						startOptions: requestStartOptions,
						contextAfterGlobalMiddlewares: context,
						request,
						executedRequestMiddlewares,
						handlerType: "serverFn"
					}, () => handleServerAction({
						request,
						context: requestOpts?.context,
						serverFnId
					}));
				};
				const { response: middlewareResponse } = await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), serverFnHandler], {
					request,
					pathname: url.pathname,
					handlerType: "serverFn",
					context: createNullProtoObject(requestOpts?.context)
				});
				const result = await handleRedirectResponse(middlewareResponse, request, getRouter);
				responseOwnsCleanup = result.serverSsrCleanup === "stream";
				return result.response;
			}
			const executeRouter = async (serverContext, matchedRoutes) => {
				const acceptParts = (request.headers.get("Accept") || "*/*").split(",");
				if (!["*/*", "text/html"].some((mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType)))) return normalizeSsrResponse(Response.json({ error: "Only HTML requests are supported here" }, { status: 500 }));
				const manifest = await resolveManifestForRequest({
					request,
					requestInlineCss: requestOpts?.inlineCss,
					getBaseManifest: () => getBaseManifest(matchedRoutes)
				});
				const earlyHints = createEarlyHintsForRequest({
					onEarlyHints: requestOpts?.onEarlyHints,
					responseLinkHeader: requestOpts?.responseLinkHeader
				});
				earlyHints?.collectStatic({
					manifest,
					matchedRoutes
				});
				const routerInstance = await getRouter();
				attachRouterServerSsrUtils({
					router: routerInstance,
					manifest,
					getRequestAssets: () => getStartContext({ throwIfNotFound: false })?.requestAssets
				});
				routerInstance.options.additionalContext = { serverContext };
				await routerInstance.load();
				if (routerInstance.state.redirect) return normalizeSsrResponse(routerInstance.state.redirect);
				earlyHints?.collectDynamic(routerInstance.stores.matches.get());
				const ctx = getStartContext({ throwIfNotFound: false });
				await routerInstance.serverSsr.dehydrate({ requestAssets: ctx?.requestAssets });
				const responseHeaders = getStartResponseHeaders({ router: routerInstance });
				earlyHints?.appendResponseHeaders(responseHeaders);
				return normalizeSsrResponse(await cb({
					request,
					router: routerInstance,
					responseHeaders
				}));
			};
			const requestHandlerMiddleware = async ({ context }) => {
				return runWithStartContext({
					getRouter,
					startOptions: requestStartOptions,
					contextAfterGlobalMiddlewares: context,
					request,
					executedRequestMiddlewares,
					handlerType: "router"
				}, async () => {
					try {
						return await handleServerRoutes({
							getRouter,
							request,
							url,
							executeRouter,
							context,
							executedRequestMiddlewares
						});
					} catch (err) {
						if (err instanceof Response) return err;
						throw err;
					}
				});
			};
			const { response: middlewareResponse } = await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), requestHandlerMiddleware], {
				request,
				pathname: url.pathname,
				handlerType: "router",
				context: createNullProtoObject(requestOpts?.context)
			});
			const response = await handleRedirectResponse(middlewareResponse, request, getRouter);
			responseOwnsCleanup = response.serverSsrCleanup === "stream";
			return response.response;
		} finally {
			if (router?.serverSsr && !responseOwnsCleanup) router.serverSsr.cleanup();
			router = null;
		}
	};
	return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter) {
	const ssrResponse = normalizeSsrResponse(response);
	if (!isRedirect(ssrResponse.response)) return ssrResponse;
	if (isResolvedRedirect(ssrResponse.response)) {
		if (request.headers.get("x-tsr-serverFn") === "true") return replaceSsrResponse(ssrResponse, Response.json({
			...ssrResponse.response.options,
			isSerializedRedirect: true
		}, { headers: ssrResponse.response.headers }), "redirect response replaced");
		return ssrResponse;
	}
	const opts = ssrResponse.response.options;
	if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
	if ([
		"params",
		"search",
		"hash"
	].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
	const redirect = (await getRouter()).resolveRedirect(ssrResponse.response);
	if (request.headers.get("x-tsr-serverFn") === "true") return replaceSsrResponse(ssrResponse, Response.json({
		...ssrResponse.response.options,
		isSerializedRedirect: true
	}, { headers: ssrResponse.response.headers }), "redirect response replaced");
	return replaceSsrResponse(ssrResponse, redirect, "redirect response replaced");
}
async function handleServerRoutes({ getRouter, request, url, executeRouter, context, executedRequestMiddlewares }) {
	const router = await getRouter();
	const pathname = executeRewriteInput(router.rewrite, url).pathname;
	const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);
	const isExactMatch = foundRoute && routeParams["**"] === void 0;
	const routeMiddlewares = [];
	for (const route of matchedRoutes) {
		const serverMiddleware = route.options.server?.middleware;
		if (serverMiddleware) {
			const flattened = flattenMiddlewares(serverMiddleware);
			for (const m of flattened) if (!executedRequestMiddlewares.has(m)) routeMiddlewares.push(m.options.server);
		}
	}
	const server = foundRoute?.options.server;
	let isHeadFallback = false;
	if (server?.handlers && isExactMatch) {
		const handlers = typeof server.handlers === "function" ? server.handlers({ createHandlers: (d) => d }) : server.handlers;
		const requestMethod = request.method.toUpperCase();
		const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
		isHeadFallback = requestMethod === "HEAD" && handler !== void 0 && !handlers["HEAD"];
		if (handler) {
			const mayDefer = !!foundRoute.options.component;
			if (typeof handler === "function") routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
			else {
				if (handler.middleware?.length) {
					const handlerMiddlewares = flattenMiddlewares(handler.middleware);
					for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
				}
				if (handler.handler) routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
			}
		}
	}
	routeMiddlewares.push(((ctx) => executeRouter(ctx.context, matchedRoutes)));
	const { ctx, response } = await executeMiddleware(routeMiddlewares, {
		request,
		context,
		params: routeParams,
		pathname,
		handlerType: "router"
	});
	if (isHeadFallback) {
		if (!ctx.response) throwRouteHandlerError();
		return stripSsrResponseBody(await handleRedirectResponse(response, request, getRouter), "HEAD body stripped");
	}
	return normalizeSsrResponse(response);
}
//#endregion
//#region node_modules/.pnpm/@tanstack+react-start@1.168.34_crossws@0.4.10_srvx@0.11.22__react-dom@19.2.8_react@19.2.8__re_7fsflfhle7woz3aanrxxgcha2a/node_modules/@tanstack/react-start/dist/default-entry/esm/server.js
var server_exports = /* @__PURE__ */ __exportAll({
	createServerEntry: () => createServerEntry,
	default: () => server_default
});
var fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
	return { async fetch(...args) {
		return await entry.fetch(...args);
	} };
}
var server_default = createServerEntry({ fetch });
//#endregion
export { createCsrfMiddleware as n, createMiddleware as r, server_exports as t };
