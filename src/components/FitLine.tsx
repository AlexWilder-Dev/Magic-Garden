import { useLayoutEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Largest font size as a fraction of the available width. */
  ratio?: number;
  /** Hard cap in px. */
  cap?: number;
  min?: number;
  className?: string;
}

/**
 * Sets a line of display type to fill its column like wood type on a gig poster,
 * using the display face's width axis first and font size second.
 */
export default function FitLine({ children, ratio = 0.16, cap = 160, min = 14, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    let raf = 0;

    const fit = () => {
      const cs = getComputedStyle(parent);
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (avail <= 0) return;
      let size = Math.max(min, Math.min(cap, avail * ratio));
      el.style.fontSize = `${size}px`;
      el.style.fontStretch = '100%';
      const w100 = el.scrollWidth || 1;
      let stretch = (100 * avail) / w100;
      if (stretch < 50) {
        stretch = 50;
        el.style.fontStretch = '50%';
        size = Math.max(min, (size * avail) / (el.scrollWidth || 1));
      }
      stretch = Math.min(150, stretch);
      el.style.fontStretch = `${stretch}%`;
      el.style.fontSize = `${size}px`;
      const w = el.scrollWidth;
      if (w > avail) el.style.fontSize = `${Math.max(min, (size * avail) / w) - 0.5}px`;
    };

    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    });
    ro.observe(parent);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [children, ratio, cap, min]);

  return (
    <span ref={ref} className={`fit ${className}`}>
      {children}
    </span>
  );
}
