import { useCallback, useEffect, useState } from "react";

/**
 * Tracks whether an element is visible in the viewport using the
 * IntersectionObserver API. Used to pause/resume heavy work (videos,
 * animations) when they scroll out of view — preventing background lag.
 *
 * Uses a callback ref so the observer is (re)created whenever the element
 * mounts/unmounts — critical for elements that are conditionally rendered
 * (e.g. a video modal that only mounts when opened).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { rootMargin: "100px" },
) {
  const [inView, setInView] = useState(false);
  const [node, setNode] = useState<T | null>(null);

  const ref = useCallback((element: T | null) => {
    setNode(element);
  }, []);

  // Create/teardown the IntersectionObserver whenever the observed node
  // changes (mounts/unmounts). This is the key fix for conditionally-rendered
  // elements: the observer is re-created against the fresh DOM node instead of
  // a stale `ref.current` that is always `null`.
  useEffect(() => {
    if (!node) {
      setInView(false);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      // Fallback for very old browsers: assume always visible.
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry?.isIntersecting ?? false);
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, options]);

  return { ref, inView };
}
