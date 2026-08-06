import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

interface VideoPortalProps {
  open: boolean;
  src: string;
  title: string;
  onClose: () => void;
}

/**
 * Cinematic video portal. The video element is only mounted once the modal is
 * opened, and `preload="none"` guarantees no bytes are fetched until the user
 * actually presses play — so the 3D scene never competes with video bandwidth.
 */
export function VideoPortal({ open, src, title, onClose }: VideoPortalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { ref: containerRef, inView } = useInView<HTMLDivElement>();

  // Pause + reset when the modal closes; release the video element.
  useEffect(() => {
    if (!open) {
      setPlaying(false);
      setVideoError(false);
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
    }
  }, [open, src]);

  // Pause when the video scrolls out of view — prevents background decoding lag.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!inView && playing) {
      v.pause();
      setPlaying(false);
    }
  }, [inView, playing]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 p-4 backdrop-blur-md"
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
            className="glass-panel w-[min(92vw,56rem)] overflow-hidden rounded-2xl md:max-h-[90vh] md:overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
              <div>
                <p className="label-mono text-primary">Live demo</p>
                <h3 className="font-display text-lg font-semibold text-starlight">{title}</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close video"
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                ✕ Close
              </button>
            </div>

            {/* Video — mounted only when open, preload="none" for zero upfront bandwidth */}
            <div ref={containerRef} className="relative aspect-video w-full bg-black">
              {videoError ? (
                <div className="flex h-full w-full items-center justify-center bg-black/60 p-8 text-center">
                  <div>
                    <p className="text-2xl">⚠️</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The video failed to load. Please try again later.
                    </p>
                    <button
                      onClick={() => setVideoError(false)}
                      className="mt-3 rounded-lg border border-primary/50 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/15"
                    >
                      Retry
                    </button>
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
                  onError={() => setVideoError(true)}
                  className="h-full w-full"
                />
              )}
              {!playing && !videoError && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-2xl text-primary">
                    ▶
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                Press play to stream the demo. Video loads on demand — no bandwidth used until you
                start it.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
