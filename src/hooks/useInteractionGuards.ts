import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';

let openDialogCount = 0;
let bodyOverflowBeforeDialogs = "";

export function useDialogFocus(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  onClose: () => void,
): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : null;
    const dialog = dialogRef.current;
    const dialogRoot = dialog?.closest<HTMLElement>('[role="dialog"][aria-modal="true"]') ?? dialog;
    const inertedElements = new Map<HTMLElement, boolean>();

    // Make every sibling outside the active dialog inert, including the app root
    // for dialogs rendered through a portal. Preserve prior inert states exactly.
    if (dialogRoot) {
      let current: HTMLElement | null = dialogRoot;
      while (current?.parentElement) {
        const parent: HTMLElement = current.parentElement;
        for (const sibling of Array.from(parent.children)) {
          if (
            sibling instanceof HTMLElement &&
            sibling !== current &&
            !inertedElements.has(sibling)
          ) {
            inertedElements.set(sibling, sibling.inert);
            sibling.inert = true;
          }
        }
        if (parent === document.body) break;
        current = parent;
      }
    }

    if (openDialogCount === 0) bodyOverflowBeforeDialogs = document.body.style.overflow;
    openDialogCount += 1;
    document.body.style.overflow = "hidden";

    const getFocusable = () => {
      const currentDialog = dialogRef.current;
      if (!currentDialog) return [];
      return Array.from(currentDialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) =>
          element.getClientRects().length > 0 && !element.closest('[inert], [aria-hidden="true"]'),
      );
    };

    const focusInitialElement = () => {
      const currentDialog = dialogRef.current;
      if (!currentDialog) return;
      const initial = currentDialog.querySelector<HTMLElement>("[data-dialog-initial-focus]");
      const firstFocusable = getFocusable()[0];
      (initial ?? firstFocusable ?? currentDialog).focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const currentDialog = dialogRef.current;
      if (!currentDialog) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        currentDialog.focus();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !currentDialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !currentDialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    const frame = window.requestAnimationFrame(focusInitialElement);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      for (const [element, wasInert] of inertedElements) element.inert = wasInert;
      openDialogCount -= 1;
      if (openDialogCount === 0) document.body.style.overflow = bodyOverflowBeforeDialogs;

      const restoreTarget =
        (previouslyFocused?.isConnected && !previouslyFocused.closest("[inert]")
          ? previouslyFocused
          : null) ??
        document.querySelector<HTMLElement>(
          '[role="region"][aria-labelledby="detail-panel-title"]',
        ) ??
        document.querySelector<HTMLElement>("[data-dialog-return-focus]");
      restoreTarget?.focus();
    };
  }, [dialogRef, open]);
}
