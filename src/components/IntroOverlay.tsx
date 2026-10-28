import { useEffect, useRef, useState } from 'react';

const WORDS = ['MUHAMMAD', 'HASHIR', 'KHAN'];

/**
 * Short opening experience: masked name reveal + crimson progress bar,
 * then a horizontal wipe into the site. Skippable with a click or Esc.
 * Disabled entirely for prefers-reduced-motion users.
 */
export default function IntroOverlay({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      onDone();
      return;
    }

    document.body.classList.add('no-scroll');

    const finish = () => {
      document.body.classList.remove('no-scroll');
      setLeaving(true);
      timers.current.push(window.setTimeout(onDone, 640));
    };

    timers.current.push(window.setTimeout(finish, 2350));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <div
      className={leaving ? 'intro intro--leave' : 'intro'}
      onClick={() => {
        if (!leaving) {
          timers.current.forEach(window.clearTimeout);
          document.body.classList.remove('no-scroll');
          setLeaving(true);
          timers.current.push(window.setTimeout(onDone, 640));
        }
      }}
      role="presentation"
      aria-hidden="true"
    >
      <div className="intro__inner">
        <div className="intro__mark">Portfolio — 2026</div>
        <div className="intro__name">
          {WORDS.map((word, i) => (
            <span className="word" key={word} style={{ marginRight: i < WORDS.length - 1 ? '0.55em' : 0 }}>
              <span style={{ animationDelay: `${0.25 + i * 0.14}s` }}>{word}</span>
            </span>
          ))}
        </div>
        <div className="intro__bar">
          <i />
        </div>
        <div className="intro__skip">Click or Esc to skip</div>
      </div>
    </div>
  );
}
