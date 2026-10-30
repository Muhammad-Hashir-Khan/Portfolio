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
 * Hard cut: the word tears open (top half up, bottom half down) exactly
 * while the subtitle fades in — one synchronized opening move — then it
 * holds; the halves rejoin into the whole word exactly while the
 * subtitle fades out — one synchronized closing move — and only after
 * that does the veil dissolve and the real page open underneath. Every
 * element completes a true open-and-close cycle, and the whole thing
 * plays exactly once per navigation.
 */
export default function TransitionIntro({ phrase, onReveal, onDone }: TransitionIntroProps) {
  const reduce = useReducedMotion();

  const opacity = useMotionValue(0);
  const wordIn = useMotionValue(0);
  const intro = useMotionValue(0);
  const subOpacity = useMotionValue(0);

  // the slices move in `em` — proportional to the rendered font size, no
  // box measurement. One shared value drives both, top negative / bottom
  // positive, so the two halves cannot desync into a one-way shift.
  // `fit` phrases keep the name's full 0.62em travel; the larger single-
  // line words scale it by the ratio of their 12vw face to the name's
  // 7.2vw face (0.62 × 7.2/12 ≈ 0.372em) so every route opens the same
  // light, small gap the name animation has.
  const openFrac = phrase.fit ? 0.62 : 0.372;
  const topY = useTransform(intro, (v) => `${-openFrac * v}em`);
  const bottomY = useTransform(intro, (v) => `${openFrac * v}em`);

  // the gap subtitle owns its own open/close cycle: 0 → 1 → 0

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
      // reduced motion: same open/close cycle, no split, plain fades
      if (reduce) {
        // the whole veil opens while the subtitle appears — together
        const coverR = animate(opacity, 1, { duration: 0.4 });
        const subInR = animate(subOpacity, 1, { duration: 0.4 });
        stops.push(coverR.stop, subInR.stop);
        await Promise.all([coverR, subInR]);
        if (!alive) return;

        const holdR = wait(400);
        stops.push(holdR.cancel);
        await holdR.done;
        if (!alive) return;

        revealRef.current();

        // no split in reduced motion — the closing move is the veil
        // lift, and the subtitle hides together with it
        const subOutR = animate(subOpacity, 0, { duration: 0.5, ease: 'easeIn' });
        const liftR = animate(opacity, 0, { duration: 0.5, ease: 'easeIn' });
        stops.push(subOutR.stop, liftR.stop);
        await Promise.all([subOutR, liftR]);
        if (!alive) return;

        doneRef.current();
        return;
      }

      // 1. blank veil covers the screen
      const cover = animate(opacity, 1, { duration: 0.2, ease: 'easeOut' });
      stops.push(cover.stop);
      await cover;
      if (!alive) return;

      // 2. the word fades in, whole and centered
      const word = animate(wordIn, 1, { duration: 0.22, ease: 'easeOut' });
      stops.push(word.stop);
      await word;
      if (!alive) return;

      // 3. one synchronized opening move — top half up, bottom half down
      //    while the subtitle fades in: same duration, same easing
      const tear = animate(intro, 1, { duration: 0.85, ease: EASE_IN_OUT });
      const subIn = animate(subOpacity, 1, { duration: 0.85, ease: EASE_IN_OUT });
      stops.push(tear.stop, subIn.stop);
      await Promise.all([tear, subIn]);
      if (!alive) return;

      // 4. the subtitle holds there for a beat
      const hold = wait(450);
      stops.push(hold.cancel);
      await hold.done;
      if (!alive) return;

      // 6. one synchronized closing move — the gap closes while the
      //    subtitle fades out: same duration, same easing
      const beat = wait(120);
      stops.push(beat.cancel);
      await beat.done;
      if (!alive) return;

      const close = animate(intro, 0, { duration: 0.8, ease: EASE_IN_OUT });
      const subOut = animate(subOpacity, 0, { duration: 0.8, ease: EASE_IN_OUT });
      stops.push(close.stop, subOut.stop);
      await Promise.all([close, subOut]);
      if (!alive) return;

      // 7. a moment with the whole word formed again
      const settle = wait(280);
      stops.push(settle.cancel);
      await settle.done;
      if (!alive) return;

      // 9. the whole veil dissolves and the real page opens underneath
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
        <motion.p className="slit__subtitle" style={{ opacity: subOpacity }} aria-hidden="true">
          <i />
          <span>{phrase.subtitle}</span>
          <i />
        </motion.p>
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
