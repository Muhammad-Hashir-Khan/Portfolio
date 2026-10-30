import { useEffect, useRef, type ReactNode } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

type SlitRevealProps = {
  text: string;
  subtitle: string;
  /** 'scrub' pins the section and drives the split with scroll (home). 'entrance' plays once on open. */
  mode?: 'scrub' | 'entrance';
  /** gates the entrance until the intro overlay has lifted */
  ready?: boolean;
  align?: 'start' | 'center';
  className?: string;
  /** extra content pinned inside the scrub card (status line, scroll cue) */
  children?: ReactNode;
};

const OPEN_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CLOSE_EASE: [number, number, number, number] = [0.7, 0, 0.3, 1];

/**
 * Cinematic center-slit reveal: the heading renders twice, each layer
 * clipped to one half (inset 0 0 50% 0 / inset 50% 0 0 0). Opening tears
 * the halves apart (top -60%, bottom +60%) and uncovers a small subtitle
 * sitting in the middle. It plays itself on page open; in 'scrub' mode a
 * pinned section also hands the same motion over to the scrollbar.
 */
export default function SlitReveal({
  text,
  subtitle,
  mode = 'entrance',
  ready = true,
  align = 'start',
  className = '',
  children,
}: SlitRevealProps) {
  const reduce = useReducedMotion();
  const pinRef = useRef<HTMLDivElement | null>(null);

  // 0 → 1 across the pinned distance (scrub mode); harmless in entrance mode
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  });

  // page-entrance timeline: tear open → hold the reveal → close back whole
  const intro = useMotionValue(0);

  useEffect(() => {
    if (reduce || !ready) return undefined;
    const controls = animate(intro, [0, 0.35, 0.55, 0.8, 0], {
      delay: 0.4,
      duration: mode === 'scrub' ? 3.4 : 3,
      times: [0, 0.3, 0.52, 0.78, 1],
      ease: [OPEN_EASE, 'linear', CLOSE_EASE, CLOSE_EASE],
    });
    return () => controls.stop();
  }, [reduce, ready, mode, intro]);

  // whichever driver is further along wins, so entrance and scroll blend
  const progress = useTransform<number, number>(
    [intro, scrollYProgress],
    (values) => Math.max(values[0], values[1]),
  );

  // whole → open → hold → closed (with a soft exit as the card releases)
  const split = useTransform(progress, [0, 0.35, 0.55, 0.8, 1], [0, 1, 1, 0, 0]);
  const topY = useTransform(split, (v) => `${-60 * v}%`);
  const bottomY = useTransform(split, (v) => `${60 * v}%`);
  const subOpacity = useTransform(split, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const cardOpacity = useTransform(progress, [0.8, 1], [1, 0]);

  if (reduce) {
    return (
      <div className={`slit slit--static slit--${align} ${className}`.trim()}>
        <h1 className="slit__text">{text}</h1>
        <p className="slit__subtitle slit__subtitle--static">
          <i aria-hidden="true" />
          <span>{subtitle}</span>
          <i aria-hidden="true" />
        </p>
        {children}
      </div>
    );
  }

  const stage = (
    <div className="slit__stage" aria-hidden="true">
      <motion.div className="slit__layer slit__layer--top" style={{ y: topY }}>
        <span className="slit__text">{text}</span>
      </motion.div>
      <motion.div className="slit__layer" style={{ y: bottomY }}>
        <span className="slit__text">{text}</span>
      </motion.div>
      <motion.p className="slit__subtitle" style={{ opacity: subOpacity }}>
        <i />
        <span>{subtitle}</span>
        <i />
      </motion.p>
    </div>
  );

  if (mode === 'scrub') {
    return (
      <div ref={pinRef} className={`slit slit--scrub slit--${align} ${className}`.trim()}>
        <motion.div className="slit-pin__sticky" style={{ opacity: cardOpacity }}>
          <h1 className="sr-only">{text}</h1>
          {stage}
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={pinRef} className={`slit slit--${align} ${className}`.trim()}>
      <h1 className="sr-only">{text}</h1>
      {stage}
    </div>
  );
}
