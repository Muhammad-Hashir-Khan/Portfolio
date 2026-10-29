import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { LuArrowRight, LuPause, LuPlay } from 'react-icons/lu';
import Reveal from './Reveal';

type CoverflowSliderProps<T> = {
  items: T[];
  itemKey: (item: T) => string;
  /** Card inner content — the slider supplies the `.cap-card` shell. */
  renderItem: (item: T) => ReactNode;
  /** Left side of the section head (usually a SectionHeading). */
  heading: ReactNode;
  ariaLabel: string;
  /** Auto-advance interval in ms. */
  autoMs?: number;
};

/**
 * Shared 3D coverflow carousel — arrows, stop/play control, count,
 * hover-pause, pointer tilt on the stage, reduced-motion static grid.
 * The CSS (.cap-stage / .cap-card3d / .cap-controls) is shared with both
 * the home capabilities slider and the projects case-study slider.
 */
export default function CoverflowSlider<T>({
  items,
  itemKey,
  renderItem,
  heading,
  ariaLabel,
  autoMs = 3600,
}: CoverflowSliderProps<T>) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const hoverRef = useRef(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltX = useMotionValue(0);
  const stageTilt = useSpring(tiltX, { stiffness: 140, damping: 20 });
  const n = items.length;

  // auto-advance — paused on hover, or via the stop button
  useEffect(() => {
    if (!playing || reduce) return;
    const id = window.setInterval(() => {
      if (!hoverRef.current) setActive((a) => (a + 1) % n);
    }, autoMs);
    return () => window.clearInterval(id);
  }, [playing, reduce, n, autoMs]);

  // shortest signed distance from the active card
  const offsetOf = (i: number) => {
    let r = (i - active) % n;
    if (r > n / 2) r -= n;
    if (r < -n / 2) r += n;
    return r;
  };

  const onStageMove = (e: ReactMouseEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    tiltX.set(((e.clientY - rect.top) / rect.height - 0.5) * -9);
  };

  // reduced motion: quiet static grid
  if (reduce) {
    return (
      <section className="section slider-section" aria-label={ariaLabel}>
        <div className="container">{heading}</div>
        <div className="container cap-static">
          {items.map((item) => (
            <article className="cap-card" key={itemKey(item)}>
              {renderItem(item)}
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section slider-section" aria-label={ariaLabel}>
      <div className="container">
        <div className="section-split-head">
          {heading}
          <Reveal className="section-split-head__link">
            <div className="cap-controls">
              <span className="cap-controls__count mono-label" aria-live="polite">
                {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
              <button
                className="icon-btn"
                onClick={() => setActive((a) => (a - 1 + n) % n)}
                aria-label="Previous item"
              >
                <LuArrowRight style={{ transform: 'rotate(180deg)' }} aria-hidden="true" />
              </button>
              <button className="icon-btn" onClick={() => setActive((a) => (a + 1) % n)} aria-label="Next item">
                <LuArrowRight aria-hidden="true" />
              </button>
              <button
                className={playing ? 'icon-btn' : 'icon-btn cap-play--paused'}
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause auto-slide' : 'Resume auto-slide'}
              >
                {playing ? <LuPause aria-hidden="true" /> : <LuPlay aria-hidden="true" />}
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <div
        className="cap-stage"
        ref={stageRef}
        onMouseMove={onStageMove}
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => {
          hoverRef.current = false;
          tiltX.set(0);
        }}
        role="region"
        aria-label={`${ariaLabel} — auto-advancing, hover to pause`}
      >
        <motion.div className="cap-stage__tilt" style={{ rotateX: stageTilt }}>
          {items.map((item, i) => {
            const r = offsetOf(i);
            const abs = Math.abs(r);
            const isActive = r === 0;
            return (
              <motion.article
                key={itemKey(item)}
                className="cap-card cap-card3d"
                initial={false}
                animate={{
                  x: r * 245,
                  scale: 1 - Math.min(abs, 2) * 0.09,
                  rotateY: r * -30,
                  opacity: abs > 2 ? 0 : 1 - abs * 0.24,
                  filter: isActive ? 'blur(0px) brightness(1)' : 'blur(1.6px) brightness(0.55)',
                }}
                transition={{ type: 'spring', stiffness: 230, damping: 27 }}
                style={{ zIndex: 20 - abs, pointerEvents: abs > 2 ? 'none' : undefined }}
                onClick={() => !isActive && setActive(i)}
                inert={!isActive || undefined}
                aria-hidden={!isActive || undefined}
              >
                {renderItem(item)}
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
