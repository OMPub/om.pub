import { useEffect, useRef, useState } from "react";

interface RevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
}

const DEFAULTS: RevealOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -8% 0px",
};

export default function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: RevealOptions
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      {
        threshold: options?.threshold ?? DEFAULTS.threshold,
        rootMargin: options?.rootMargin ?? DEFAULTS.rootMargin,
      }
    );
    obs.observe(node);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, visible };
}
