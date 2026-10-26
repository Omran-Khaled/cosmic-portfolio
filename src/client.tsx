import { StrictMode, startTransition } from "react";
import { hydrateRoot, type HydrationOptions } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

const element = (
  <StrictMode>
    <StartClient />
  </StrictMode>
);

// React never throws hydration mismatches (error #418); it reports them through
// `onRecoverableError` and then re-renders on the client. Logging the error
// and re-dispatching it keeps the failure visible in the console and to global
// error handlers instead of swallowing it.
const onRecoverableError: NonNullable<HydrationOptions["onRecoverableError"]> = (
  error,
  errorInfo,
) => {
  console.error("[hydration] recoverable error:", error, errorInfo?.componentStack);
  reportError(error);
};

startTransition(() => {
  hydrateRoot(document, element, { onRecoverableError });
});
