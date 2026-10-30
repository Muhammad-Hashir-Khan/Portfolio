import { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';

export type IntroPhrase = { text: string; subtitle: string; fit?: boolean };

type TransitionIntroProps = {
  phrase: IntroPhrase;
  /** fires the moment the veil is ready to open — page content may enter */
  onReveal: () => void;
  /** fires after the veil has fully lifted — safe to unmount */
  onDone: () => void;
};

const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/**
 * Full-screen route transition. The current page disappears and a blank
 * screen appears carrying only the next page's word. The word then tears
 * once, slowly and simultaneously: the top half travels UP and the bottom
 * half travels DOWN the exact same distance, opening a gap in the middle.
 * A small red subtitle sits in that gap, holds, and then the whole veil
 * dissolves and the real page opens underneath. Plays exactly once.
 */
export default function TransitionIntro({ phrase, onReveal, onDone }: TransitionIntroProps) {
  const reduce = useReducedMotion();

  const opacity = useMotionValue(0);
  const wordIn = useMotionValue(0);
  const intro = useMotionValue(0);

  // the slices move in `em` — proportional to the rendered font size, no
  // box measurement. One shared value drives both, top negative / bottom
  // positive, so the two halves cannot desync into a one-way shift.
  const topY = useTransform(intro, (v) => `${-0.62 * v}em`);
  const bottomY = useTransform(intro, (v) => `${0.62 * v}em`);
  const subOpacity = useTransform(intro, [0.25, 0.55], [0, 1]);

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

    const wait = (ms: number) => {
      let timer = 0;
      const done = new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
      return { done, cancel: () => window.clearTimeout(timer) };
    };

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
      const cover = animate(opacity, 1, { duration: 0.2, ease: 'easeOut' });
      stops.push(cover.stop);
      await cover;
      if (!alive) return;

      // 2. the word fades in, whole and centered
      const word = animate(wordIn, 1, { duration: 0.25, ease: 'easeOut' });
      stops.push(word.stop);
      await word;
      if (!alive) return;

      // 3. one slow ease-in-out tear — the word stays open,
      //    no closing bounce, exactly once
      const tear = animate(intro, 1, { duration: 1.1, ease: EASE_IN_OUT });
      stops.push(tear.stop);
      await tear;
      if (!alive) return;

      // 4. the subtitle sits in the center for a moment
      const hold = wait(450);
      stops.push(hold.cancel);
      await hold.done;
      if (!alive) return;

      // 5. the whole veil dissolves and the real page opens underneath
      revealRef.current();

      const lift = animate(opacity, 0, { duration: 0.5, ease: EASE_IN_OUT });
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

  const textClass = `slit__text${phrase.fit ? ' slit__text--fit' : ''}`;

  if (reduce) {
    return (
      <motion.div className="tintro tintro--static" style={{ opacity }}>
        <p className="sr-only">{phrase.text}</p>
        <span className={textClass} aria-hidden="true">
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
        <motion.span
          className={`${textClass} slit__text--top`}
          style={{ opacity: wordIn, y: topY }}
        >
          {phrase.text}
        </motion.span>
        <motion.span
          className={`${textClass} slit__text--bot`}
          style={{ opacity: wordIn, y: bottomY }}
        >
          {phrase.text}
        </motion.span>
        <motion.p className="slit__subtitle" style={{ opacity: subOpacity }}>
          <i />
          <span>{phrase.subtitle}</span>
          <i />
        </motion.p>
      </div>
    </motion.div>
  );
}
