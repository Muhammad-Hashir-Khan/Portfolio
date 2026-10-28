import { useEffect, useRef } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import Portrait from './Portrait';
import { profile } from '../data/portfolio';

export default function Hero({ ready }: { ready: boolean }) {
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  // Subtle, transform-only parallax on the portrait (pointer-free, safe on touch)
  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const el = portraitRef.current;
    if (!el) return;

    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y <= window.innerHeight * 1.3) {
          el.style.setProperty('--parallax', `${(y * 0.05).toFixed(1)}px`);
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <section id="home" className={ready ? 'hero is-ready' : 'hero'} aria-label="Introduction">
      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__eyebrow hero__anim hero__anim--d1">
            <span aria-hidden="true" />
            <i>Independent developer / AI automation</i>
          </div>

          <h1 className="hero__title">
            <span className="line-mask">
              <span className="line-inner">I build</span>
            </span>
            <span className="line-mask">
              <span className="line-inner tx-crimson">intelligent systems</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">that do more with less.</span>
            </span>
          </h1>

          <p className="hero__sub hero__anim hero__anim--d3">
            I&rsquo;m {profile.name}, an {profile.title} focused on intelligent workflows, practical AI
            integrations, and digital solutions that help businesses work smarter.
          </p>

          <div className="hero__cta-row hero__anim hero__anim--d4">
            <a href="#projects" className="btn btn--primary">
              Explore My Work
              <LuArrowRight aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn--ghost">
              Discuss an Opportunity
            </a>
          </div>

          <div className="hero__avail hero__anim hero__anim--d5">
            <span className="pulse-dot" aria-hidden="true" />
            <span>
              <b>{profile.availability.status}</b> · {profile.availability.detail}
            </span>
          </div>
        </div>

        <div className="hero__visual hero__anim hero__anim--d6">
          <div className="hero__side-label" aria-hidden="true">
            Focus // {profile.title}
          </div>

          <div className="hero__portrait" ref={portraitRef}>
            <Portrait />
          </div>

          <div className="hero__meta-card">
            <span>{profile.title.toUpperCase()}</span>
            <b>{profile.name}</b>
          </div>
        </div>
      </div>

      <div className="hero__scroll hero__anim hero__anim--d6" aria-hidden="true">
        <span />
        <i>Scroll</i>
      </div>
    </section>
  );
}
