import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LuArrowRight, LuArrowUpRight } from 'react-icons/lu';
import Page from '../components/Page';
import Portrait from '../components/Portrait';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import ProjectCard from '../components/ProjectCard';
import { profile, projects, services } from '../data/portfolio';
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

      {/* ═══ CAPABILITIES SLIDER ═══ */}
      <CapabilitiesSlider />

      {/* ═══ CTA BAND ═══ */}
      <section className="cta-band" aria-label="Next step">
        <div className="container">
          <Reveal className="cta-band__inner">
            <p className="mono-label">Next step</p>
            <h2>
              Have a repetitive process?
              <br />
              <span className="tx-crimson">Let&rsquo;s automate it.</span>
            </h2>
            <div className="hero__cta-row cta-band__row">
              <Link to="/contact" className="btn btn--primary">
                Start a Conversation
                <LuArrowRight aria-hidden="true" />
              </Link>
              <Link to="/services" className="btn btn--ghost">
                View Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}

/* ── auto-drifting capabilities rail (infinite, pauses on hover) ────── */

function CapabilitiesSlider() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (reduce) return;

    let raf = 0;
    let last = performance.now();
    const speed = 0.045; // px per ms

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const el = trackRef.current;
      if (el && !pausedRef.current) {
        const cs = window.getComputedStyle(el);
        const gap = parseFloat(cs.columnGap || cs.gap) || 0;
        const setWidth = (el.scrollWidth + gap) / 2;
        if (setWidth > 0) {
          offsetRef.current = (offsetRef.current + dt * speed) % setWidth;
          el.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const cards = [...services, ...services];

  return (
    <section className="section slider-section" aria-label="Capabilities">
      <div className="container">
        <SectionHeading label="Capabilities" title="What I bring to a build." />
      </div>

      <div
        className={reduce ? 'cap-viewport cap-viewport--static' : 'cap-viewport'}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onFocusCapture={() => (pausedRef.current = true)}
        onBlurCapture={() => (pausedRef.current = false)}
        role="region"
        aria-label="Services — auto-scrolling; hover to pause"
        tabIndex={reduce ? 0 : -1}
      >
        <div className={reduce ? 'cap-track cap-track--static' : 'cap-track'} ref={trackRef}>
          {cards.map((service, i) => {
            const duplicate = i >= services.length;
            return (
              <article
                className="cap-card"
                key={`${service.id}-${i}`}
                aria-hidden={duplicate || undefined}
                inert={duplicate || undefined}
              >
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
                    tabIndex={duplicate ? -1 : undefined}
                  >
                    Discuss
                    <LuArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
