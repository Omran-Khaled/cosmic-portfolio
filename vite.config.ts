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
    }),
    viteReact(),
    tailwindcss(),
  ],
  build: {
    // CSS code splitting: extract critical CSS per route for faster initial paint
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three") || id.includes("@react-three")) return "vendor-three";
            if (id.includes("react") || id.includes("react-dom")) return "vendor-react";
            if (id.includes("framer-motion")) return "vendor-framer";
            if (id.includes("@tanstack")) return "vendor-router";
            return "vendor";
          }
          return undefined;
        },
      },
    },
  },
});
