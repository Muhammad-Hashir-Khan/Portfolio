import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { LuArrowRight, LuArrowUpRight, LuPause, LuPlay } from 'react-icons/lu';
import Page from '../components/Page';
import Portrait from '../components/Portrait';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import ProjectCard from '../components/ProjectCard';
import { profile, projects, services, type Service } from '../data/portfolio';
import { waLink } from '../lib/links';

const LINE_EASE = [0.16, 1, 0.3, 1] as const;

const BENEFITS = [
  {
    index: '01',
    title: 'Less routine',
    text: 'Repetitive manual tasks move from people to well-designed automation, freeing attention for work that needs judgement.',
  },
  {
    index: '02',
    title: 'Connected systems',
    text: 'Applications talk to each other through APIs and webhooks instead of through copy-paste and re-typing.',
  },
  {
    index: '03',
    title: 'Cleaner data',
    text: 'Information is validated and structured where it enters the system — not patched together afterwards.',
  },
  {
    index: '04',
    title: 'Consistent execution',
    text: 'Workflows run the same way every time, with logs you can trace — fewer exceptions, fewer silent failures.',
  },
  {
    index: '05',
    title: 'AI inside operations',
    text: 'Practical AI integrated into existing tools and processes — working infrastructure, not a demo video.',
  },
  {
    index: '06',
    title: 'Quiet automation',
    text: 'Notifications, reports and routine business processes handled automatically in the background.',
  },
];

export default function HomePage({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const portraitY = useTransform(scrollY, [0, 640], [0, -42]);
  const portraitScale = useTransform(scrollY, [0, 640], [1, 1.035]);
  const cueOpacity = useTransform(scrollY, [0, 260], [1, 0]);

  const state = ready ? 'show' : 'hidden';

  return (
    <Page className="home">
      {/* ═══ HERO ═══ */}
      <section className="hero" aria-label="Introduction">
        <div className="container hero__inner">
          <div className="hero__content">
            <motion.h1
              className="hero__title"
              initial="hidden"
              animate={state}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
            >
              <span className="line-mask">
                <motion.span className="line-inner" variants={{ hidden: { y: '112%' }, show: { y: 0, transition: { duration: 1.05, ease: LINE_EASE } } }}>
                  I build
                </motion.span>
              </span>
              <span className="line-mask">
                <motion.span className="line-inner tx-crimson" variants={{ hidden: { y: '112%' }, show: { y: 0, transition: { duration: 1.05, ease: LINE_EASE } } }}>
                  intelligent systems
                </motion.span>
              </span>
              <span className="line-mask">
                <motion.span className="line-inner" variants={{ hidden: { y: '112%' }, show: { y: 0, transition: { duration: 1.05, ease: LINE_EASE } } }}>
                  that do more with less.
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              className="hero__sub"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: LINE_EASE }}
            >
              I&rsquo;m {profile.name}, an {profile.title} focused on intelligent workflows, practical AI
              integrations, and digital solutions that help businesses work smarter.
            </motion.p>

            <motion.div
              className="hero__cta-row"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.68, ease: LINE_EASE }}
            >
              <Link to="/projects" className="btn btn--primary">
                Explore My Work
                <LuArrowRight aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn btn--ghost">
                Discuss an Opportunity
              </Link>
            </motion.div>

            <motion.div
              className="hero__avail"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: LINE_EASE }}
            >
              <span className="pulse-dot" aria-hidden="true" />
              <span>
                <b>{profile.availability.status}</b> · {profile.availability.detail}
              </span>
            </motion.div>
          </div>

          <div className="hero__visual">
            <motion.div
              className="hero__portrait"
              style={reduce ? undefined : { y: portraitY, scale: portraitScale }}
              initial={reduce ? false : { opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              animate={reduce ? undefined : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.5, ease: LINE_EASE }}
            >
              <Portrait />
            </motion.div>

            <motion.div
              className="hero__meta-card"
              initial={reduce ? false : { opacity: 0, x: -22 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: LINE_EASE }}
            >
              <span>{profile.title.toUpperCase()}</span>
              <b>{profile.name}</b>
            </motion.div>
          </div>
        </div>

        <motion.div className="hero__scroll" style={reduce ? undefined : { opacity: cueOpacity }} aria-hidden="true">
          <span />
          <i>Scroll</i>
        </motion.div>
      </section>

      <Marquee />

      {/* ═══ THE PROBLEM ═══ */}
      <section className="section" aria-label="The problem automation solves">
        <div className="container">
          <SectionHeading
            label="The problem"
            title={
              <>
                Less repetitive work. <span className="tx-crimson">More intelligent execution.</span>
              </>
            }
            lead="These are the effects my work aims for when a solution is properly implemented:"
          />

          <div className="value-list">
            {BENEFITS.map((benefit, i) => (
              <Reveal key={benefit.index} delay={i * 0.05}>
                <div className="value-line">
                  <span className="mono-label">{benefit.index}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED WORK ═══ */}
      <section className="section" aria-label="Featured work">
        <div className="container">
          <div className="section-split-head">
            <SectionHeading label="Selected work" title="Technical demonstrations." />
            <Reveal className="section-split-head__link">
              <Link to="/projects" className="link-arrow">
                All projects
                <LuArrowUpRight aria-hidden="true" />
              </Link>
            </Reveal>
          </div>

          <div className="projects__grid projects__grid--home">
            <Reveal>
              <ProjectCard
                project={projects[0]}
                action={
                  <Link to="/projects" className="project-card__open">
                    View case studies
                    <LuArrowUpRight aria-hidden="true" />
                  </Link>
                }
              />
            </Reveal>
            <Reveal delay={0.08}>
              <ProjectCard
                project={projects[1]}
                action={
                  <Link to="/projects" className="project-card__open">
                    View case studies
                    <LuArrowUpRight aria-hidden="true" />
                  </Link>
                }
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ CAPABILITIES — 3D COVERFLOW ═══ */}
      <CapabilitiesSlider />

      {/* ═══ CTA SLAB ═══ */}
      <section className="cta-slab" aria-label="Next step">
        <div className="container cta-slab__inner">
          <Reveal className="cta-slab__text">
            <p className="mono-label">Next step</p>
            <h2>
              Have a repetitive process?
              <br />
              <span className="tx-crimson">Let&rsquo;s automate it.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="cta-slab__action cta-slab__action--row">
            <Link to="/contact" className="btn btn--primary">
              Start a Conversation
              <LuArrowRight aria-hidden="true" />
            </Link>
            <Link to="/services" className="btn btn--ghost">
              View Services
            </Link>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}

/* ── 3D coverflow capabilities carousel ─────────────────────────────── */

function CapabilitiesSlider() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const hoverRef = useRef(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltX = useMotionValue(0);
  const stageTilt = useSpring(tiltX, { stiffness: 140, damping: 20 });
  const n = services.length;

  // auto-advance — paused on hover, or via the stop button
  useEffect(() => {
    if (!playing || reduce) return;
    const id = window.setInterval(() => {
      if (!hoverRef.current) setActive((a) => (a + 1) % n);
    }, 3600);
    return () => window.clearInterval(id);
  }, [playing, reduce, n]);

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
      <section className="section slider-section" aria-label="Capabilities">
        <div className="container">
          <SectionHeading label="Capabilities" title="What I bring to a build." />
        </div>
        <div className="container cap-static">
          {services.map((service) => (
            <CapCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section slider-section" aria-label="Capabilities">
      <div className="container">
        <div className="section-split-head">
          <SectionHeading label="Capabilities" title="What I bring to a build." />
          <Reveal className="section-split-head__link">
            <div className="cap-controls">
              <span className="cap-controls__count mono-label" aria-live="polite">
                {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
              <button
                className="icon-btn"
                onClick={() => setActive((a) => (a - 1 + n) % n)}
                aria-label="Previous service"
              >
                <LuArrowRight style={{ transform: 'rotate(180deg)' }} aria-hidden="true" />
              </button>
              <button className="icon-btn" onClick={() => setActive((a) => (a + 1) % n)} aria-label="Next service">
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
        aria-label="Services carousel — auto-advancing, hover to pause"
      >
        <motion.div className="cap-stage__tilt" style={{ rotateX: stageTilt }}>
          {services.map((service, i) => {
            const r = offsetOf(i);
            const abs = Math.abs(r);
            const isActive = r === 0;
            return (
              <motion.article
                key={service.id}
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
                <CapCardInner service={service} />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function CapCardInner({ service }: { service: Service }) {
  return (
    <>
      <span className="mono-label">Service {service.index}</span>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <div className="cap-card__foot">
        <span className="slider__price">
          FROM <b>${service.price}</b>
        </span>
        <a
          className="slider__link"
          href={waLink(service.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Discuss ${service.name} on WhatsApp`}
        >
          Discuss
          <LuArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

function CapCard({ service }: { service: Service }) {
  return (
    <article className="cap-card">
      <CapCardInner service={service} />
    </article>
  );
}
