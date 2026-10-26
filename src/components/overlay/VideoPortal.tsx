import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useInView } from "@/hooks/useInView";
import { useDialogFocus } from "@/hooks/useInteractionGuards";

interface VideoPortalProps {
  open: boolean;
  src: string;
  title: string;
  onClose: () => void;
  // `| undefined` keeps the prop assignable under exactOptionalPropertyTypes
  // when callers forward an optional value (e.g. `demo?.fallbackHref`).
  fallbackHref?: string | undefined;
}

/**
 * Cinematic video portal. The video element is only mounted once the modal is
 * opened, and `preload="none"` guarantees no bytes are fetched until the user
 * actually presses play so the 3D scene never competes with video bandwidth.
 * Renders via createPortal to document.body to escape containing blocks from
 * ancestor glass-panel/backdrop-filter elements.
 */
export function VideoPortal({ open, src, title, onClose, fallbackHref }: VideoPortalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { ref: containerRef, inView } = useInView<HTMLDivElement>();
  // Tracks whether the video container has ever been in view. Prevents the
  // initial `inView=false` state (before the IntersectionObserver fires) from
  // immediately pausing a freshly-opened modal.
  const wasInViewRef = useRef(false);
  useDialogFocus(open, dialogRef, onClose);

  // Pause + reset when the modal closes; release the video element.
  useEffect(() => {
    if (!open) {
      setPlaying(false);
      setVideoError(false);
      wasInViewRef.current = false;
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
    }
  }, [open, src]);

  // Pause when the video scrolls out of view prevents background decoding lag.
  // Only pause if the video was previously in view (i.e. the user actually
  // started it while it was visible). This prevents the initial `inView=false`
  // state from immediately pausing a freshly-opened modal.
  useEffect(() => {
    if (inView) {
      wasInViewRef.current = true;
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (wasInViewRef.current && playing) {
      v.pause();
      setPlaying(false);
    }
  }, [inView, playing]);

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 px-4 py-[calc(1rem+env(safe-area-inset-top)+env(safe-area-inset-bottom))] backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} demo video`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel max-h-[calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-[min(92vw,56rem)] overflow-y-auto rounded-2xl"
            ref={dialogRef}
            tabIndex={-1}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
              <div>
                <p className="label-mono text-primary">Live demo</p>
                <h3 className="font-display text-lg font-semibold text-starlight">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-dialog-initial-focus
                aria-label="Close video"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                x Close
              </button>
            </div>

            {/* Video mounted only when open, preload="none" for zero upfront bandwidth */}
            <div ref={containerRef} className="relative aspect-video w-full bg-black">
              {videoError ? (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="flex h-full w-full items-center justify-center bg-black/60 p-8 text-center"
                >
                  <div>
                    <p className="text-2xl">!</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This demo could not be loaded. Retry it or open the project repository
                      instead.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setVideoError(false)}
                        className="min-h-11 rounded-lg border border-primary/50 px-3 py-2 text-xs text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Retry video
                      </button>
                      {fallbackHref && (
                        <a
                          href={fallbackHref}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-3 py-2 text-xs text-foreground transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          Open project on GitHub ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={src}
                  preload="none"
                  controls
                  playsInline
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onError={(event) => {
                    if (import.meta.env.DEV) {
                      console.warn("[VideoPortal] Demo video failed to load", {
                        source: src,
                        mediaErrorCode: event.currentTarget.error?.code ?? null,
                      });
                    }
                    setVideoError(true);
                  }}
                  className="h-full w-full"
                />
              )}
              {!playing && !videoError && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-2xl text-primary">
                    Play
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                Press play to stream the demo. Video loads on demand no bandwidth used until you
                start it.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
