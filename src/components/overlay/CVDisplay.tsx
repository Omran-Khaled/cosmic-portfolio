import React, { useEffect, useState } from "react";

/** Static asset supplied by the site owner at public/cv/omran_khaled.pdf. */
const CV_URL = `${import.meta.env.BASE_URL}cv/omran_khaled.pdf`;
const DOWNLOAD_NAME = "Omran_Khaled_CV.pdf";
type CVStatus = "checking" | "available" | "missing" | "error";

export const CVDisplay = React.memo(() => {
  const [status, setStatus] = useState<CVStatus>("checking");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const checkAvailability = async () => {
      try {
        const response = await fetch(CV_URL, {
          method: "HEAD",
          credentials: "same-origin",
          cache: "no-store",
        });
        if (cancelled) return;

        if (response.status === 404) {
          setStatus("missing");
          return;
        }
        if (!response.ok) {
          setStatus("error");
          return;
        }

        const contentType = (response.headers.get("content-type") ?? "").toLowerCase();
        if (contentType.includes("application/pdf")) {
          setStatus("available");
        } else if (contentType.includes("text/html")) {
          // A SPA fallback page must never be offered as a downloadable PDF.
          setStatus("missing");
        } else {
          setStatus("error");
        }
      } catch (error) {
        if (!cancelled && import.meta.env.DEV) {
          console.warn("[CVDisplay] CV availability check failed", error);
        }
        if (!cancelled) setStatus("error");
      }
    };

    void checkAvailability();
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  if (status === "missing") {
    return (
      <p
        role="status"
        className="rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-center text-sm leading-relaxed text-muted-foreground"
      >
        The CV PDF is not available in this published build. Please use the contact links to request
        a copy.
      </p>
    );
  }

  if (status === "error") {
    return (
      <div
        role="status"
        className="rounded-xl border border-border/70 bg-secondary/30 px-4 py-3 text-center"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          The CV could not be verified right now. Check your connection or try again.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("checking");
            setRetryKey((key) => key + 1);
          }}
          className="mt-2 min-h-11 rounded-full border border-primary/40 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Check again
        </button>
      </div>
    );
  }

  return (
    <a
      href={CV_URL}
      download={DOWNLOAD_NAME}
      onClick={(event) => {
        if (status !== "available") event.preventDefault();
      }}
      aria-disabled={status !== "available"}
      aria-label={status === "available" ? "Download CV as PDF" : "Checking CV PDF availability"}
      className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-primary/60 bg-primary/15 px-4 py-3 text-center text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/25 hover:shadow-[var(--shadow-glow)] active:scale-[0.98] aria-disabled:cursor-wait aria-disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span aria-hidden="true">⬇</span>
      {status === "available" ? "Download CV" : "Checking CV…"}
    </a>
  );
});

CVDisplay.displayName = "CVDisplay";
