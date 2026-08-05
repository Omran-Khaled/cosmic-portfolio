import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { r as createMiddleware } from "./vendor-react-DCIJmF58.js";
//#region node_modules/.pnpm/@tanstack+start-client-core@1.170.14/node_modules/@tanstack/start-client-core/dist/esm/createStart.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
//#endregion
//#region node_modules/.pnpm/@tanstack+start-server-core@1.169.17_crossws@0.4.10_srvx@0.11.22_/node_modules/@tanstack/start-server-core/dist/esm/empty-plugin-adapters.js
var empty_plugin_adapters_exports = /* @__PURE__ */ __exportAll({
	hasPluginAdapters: () => false,
	pluginSerializationAdapters: () => pluginSerializationAdapters
});
var pluginSerializationAdapters = [];
//#endregion
export { createStart as n, empty_plugin_adapters_exports as t };
