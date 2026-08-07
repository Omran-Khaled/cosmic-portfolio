import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/cosmic-portfolio/",
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      server: { entry: "server" },
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
        entryFileNames: "assets/[name].js",
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
            if (id.includes("react") || id.includes("react-dom") || id.includes("scheduler"))
              return "vendor-react";
            if (id.includes("framer-motion") || id.includes("motion")) return "vendor-framer";
            if (id.includes("@tanstack")) return "vendor-router";
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
});
