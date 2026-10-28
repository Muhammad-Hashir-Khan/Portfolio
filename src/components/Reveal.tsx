import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/**
 * Scroll-triggered reveal wrapper — IntersectionObserver adds the
 * `reveal--in` class once, then disconnects (no repeat animations).
 * Reduced-motion users get content immediately, no transition.
 */
export default function Reveal({ children, delay = 0, className = '', style, id }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={shown ? `reveal reveal--in ${className}`.trim() : `reveal ${className}`.trim()}
      style={{ ...style, transitionDelay: shown && delay ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
