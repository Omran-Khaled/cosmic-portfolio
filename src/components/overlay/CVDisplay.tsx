import React from "react";

/**
 * Static asset served from `public/cv/omran_khaled_cv.pdf`.
 * Using `import.meta.env.BASE_URL` keeps the path correct under any
 * deployment sub-path (e.g. `/cosmic-portfolio/` on GitHub Pages).
 */
const CV_URL = `${import.meta.env.BASE_URL}cv/omran_khaled_cv.pdf`;
const DOWNLOAD_NAME = "Omran_Khaled_CV.pdf";

/**
 * Single, polished download action for the Curriculum Vitae.
 * Uses the native `download` attribute so the browser saves the file directly.
 */
export const CVDisplay = React.memo(() => {
  return (
    <a
      href={CV_URL}
      download={DOWNLOAD_NAME}
      className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-primary/60 bg-primary/15 px-4 py-3 text-center text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/25 hover:shadow-[var(--shadow-glow)] active:scale-[0.98]"
      aria-label="Download CV as PDF"
    >
      <span aria-hidden="true">⬇</span>
      Download CV
    </a>
  );
});

CVDisplay.displayName = "CVDisplay";
