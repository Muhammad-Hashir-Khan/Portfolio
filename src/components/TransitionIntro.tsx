import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';

export type IntroPhrase = { text: string; subtitle: string };

type TransitionIntroProps = {
  phrase: IntroPhrase;
  /** fires the moment the word closes back whole — page content may enter */
  onReveal: () => void;
  /** fires after the veil has fully lifted — safe to unmount */
  onDone: () => void;
};

const OPEN_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CLOSE_EASE: [number, number, number, number] = [0.7, 0, 0.3, 1];

/**
 * Full-screen route transition. The current page disappears and a blank
 * screen appears carrying only the next page's word. The word fades in
 * whole, tears into two clipped halves (top -60% / bottom +60%) and
 * uncovers a small subtitle sitting in the gap, closes back, and the
 * veil lifts — only then does the real page open underneath.
 */
export default function TransitionIntro({ phrase, onReveal, onDone }: TransitionIntroProps) {
  const reduce = useReducedMotion();

  const opacity = useMotionValue(0);
  const wordIn = useMotionValue(0);
  const intro = useMotionValue(0);

  // half-cut mapping: whole → open → hold → closed
  const split = useTransform(intro, [0, 0.35, 0.55, 0.8], [0, 1, 1, 0]);
  const topY = useTransform(split, (v) => `${-60 * v}%`);
  const bottomY = useTransform(split, (v) => `${60 * v}%`);
  const subOpacity = useTransform(split, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0]);

  // callbacks go through refs so re-renders in App can't restart the timeline
  const revealRef = useRef(onReveal);
  const doneRef = useRef(onDone);
  useEffect(() => {
    revealRef.current = onReveal;
    doneRef.current = onDone;
  });

  // the veil is the whole page while it plays — lock the scroll underneath
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  useEffect(() => {
    const stops: Array<() => void> = [];
    let alive = true;

    // failsafe: never leave the site stuck behind the veil
    const failsafe = window.setTimeout(() => {
      if (!alive) return;
      revealRef.current();
      doneRef.current();
    }, 7000);
    stops.push(() => window.clearTimeout(failsafe));

    const run = async () => {
      if (reduce) {
        stops.push(animate(opacity, 1, { duration: 0.4 }).stop);
        const revealT = window.setTimeout(() => {
          if (!alive) return;
          revealRef.current();
          stops.push(animate(opacity, 0, { duration: 0.5, ease: 'easeIn' }).stop);
        }, 1100);
        const doneT = window.setTimeout(() => {
          if (alive) doneRef.current();
        }, 1800);
        stops.push(() => {
          window.clearTimeout(revealT);
          window.clearTimeout(doneT);
        });
        return;
      }

      // 1. blank veil covers the screen
      const cover = animate(opacity, 1, { duration: 0.3, ease: 'easeOut' });
      stops.push(cover.stop);
      await cover;
      if (!alive) return;

      // 2. the word fades in, whole and centered
      const word = animate(wordIn, 1, { duration: 0.45, ease: 'easeOut' });
      stops.push(word.stop);
      await word;
      if (!alive) return;

      // 3. half-cut reveal: tear open → hold the subtitle → close back
      const tear = animate(intro, [0, 0.35, 0.55, 0.8, 0], {
        duration: 2.3,
        times: [0, 0.3, 0.5, 0.75, 1],
        ease: [OPEN_EASE, 'linear', CLOSE_EASE, CLOSE_EASE],
      });
      stops.push(tear.stop);
      await tear;
      if (!alive) return;

      // 4. let the page content enter while the veil dissolves
      revealRef.current();

      const lift = animate(opacity, 0, { duration: 0.55, ease: 'easeIn' });
      stops.push(lift.stop);
      await lift;
      if (!alive) return;

      doneRef.current();
    };

    run().catch(() => undefined);

    return () => {
      alive = false;
      stops.forEach((stop) => stop());
    };
    // phrase identity is stable (module constants), so this runs once per veil
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, phrase]);

  if (reduce) {
    return (
      <motion.div className="tintro tintro--static" style={{ opacity }}>
        <p className="sr-only">{phrase.text}</p>
        <span className="slit__text" aria-hidden="true">
          {phrase.text}
        </span>
        <p className="slit__subtitle" aria-hidden="true">
          <i />
          <span>{phrase.subtitle}</span>
          <i />
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div className="tintro" style={{ opacity }}>
      <p className="sr-only">{phrase.text}</p>
      <div className="tintro__stage" aria-hidden="true">
        <motion.div className="slit__layer slit__layer--top" style={{ opacity: wordIn, y: topY }}>
          <span className="slit__text">{phrase.text}</span>
        </motion.div>
        <motion.div className="slit__layer slit__layer--bottom" style={{ opacity: wordIn, y: bottomY }}>
          <span className="slit__text">{phrase.text}</span>
        </motion.div>
        <motion.p className="slit__subtitle" style={{ opacity: subOpacity }}>
          <i />
          <span>{phrase.subtitle}</span>
          <i />
        </motion.p>
      </div>
    </motion.div>
  );
}
