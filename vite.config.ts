import { env } from "node:process";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => {
  const configuredBase = env["VITE_BASE"] ?? (command === "serve" ? "/" : "/cosmic-portfolio/");
  const base =
    configuredBase === "/" ? "/" : `/${configuredBase.split("/").filter(Boolean).join("/")}/`;

  return {
    // Local development defaults to root. Production defaults to the GitHub Pages
    // project path. `preview:static` is the supported base-aware local preview.
    base,
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tanstackStart({
        // `spa.prerender.outputPath` decides where the prerendered SPA shell is
        // written. "/index" makes the framework emit `dist/client/index.html`,
        // which is the document GitHub Pages serves.
        spa: { enabled: true, prerender: { outputPath: "/index" } },
        // Entry paths are resolved relative to `srcDirectory` ("src"), so they
        // must not repeat the "src/" prefix.
        server: { entry: "server.ts" },
        client: { entry: "client.tsx" },
      }),
      viteReact(),
      tailwindcss(),
    ],
    build: {
      cssCodeSplit: true,
      // Vite 8 minifies by default (uses oxc/rolldown) — no esbuild dependency needed.
      chunkSizeWarningLimit: 600,
      target: "es2020",
      rollupOptions: {
        output: {
          entryFileNames: (chunk) => {
            // Server entry must be at dist/server/server.js (not in assets/)
            // so that @tanstack/start preview-server-plugin can find it.
            if (chunk.name === "server") {
              return "[name].js";
            }
            return "assets/[name].js";
          },
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (
                id.includes("three") ||
                id.includes("@react-three") ||
                id.includes("postprocessing")
              )
                return "vendor-three";
              if (/[\\/]node_modules[\\/]((react|react-dom|scheduler)([\\/]|$))/.test(id))
                return "vendor-react";
              if (/[\\/]node_modules[\\/]framer-motion([\\/]|$)/.test(id)) return "vendor-framer";
              if (/[\\/]node_modules[\\/]@tanstack([\\/]|$)/.test(id)) return "vendor-router";
              if (id.includes("zustand")) return "vendor-zustand";
              return "vendor";
            }
            return undefined;
          },
        },
      },
    },
    optimizeDeps: {
      include: ["three", "@react-three/fiber", "@react-three/drei", "framer-motion"],
    },
  };
});
