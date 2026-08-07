import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

// Static deployment (GitHub Pages) has no SSR HTML to hydrate — the
// `public/index.html` is just a shell. Using `createRoot` instead of
// `hydrateRoot` avoids React error #418 (hydration mismatch) caused by
// the static HTML's `<div id="root">` not matching the `RootShell`
// component which renders `<html>/<head>/<body>` directly.
const rootElement = document.getElementById("root")!;

startTransition(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
