import { type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { LuArrowRight, LuArrowUpRight, LuDownload } from 'react-icons/lu';
import Page from '../components/Page';
import Portrait from '../components/Portrait';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import CoverflowSlider from '../components/CoverflowSlider';
import ProjectCover from '../components/ProjectCover';
import { profile, resume, services, type Service } from '../data/portfolio';
import { gmailCompose, waLink } from '../lib/links';
import { useResumeAvailable } from '../lib/useResume';

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
              <HeroResumeButton />
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

      {/* ═══ CAPABILITIES — 3D COVERFLOW ═══ */}
      <CoverflowSlider
        items={services}
        itemKey={(service) => service.id}
        renderItem={(service) => <CapCardInner service={service} />}
        heading={<SectionHeading label="Capabilities" title="What I bring to a build." />}
        ariaLabel="Services carousel"
      />

      {/* ═══ CTA — OPEN EDITORIAL SPLIT ═══ */}
      <section className="section cta-slab" aria-label="Next step">
        <div className="container">
          <CtaSplit />
        </div>
      </section>
    </Page>
  );
}

/* ── hero resume button — always visible, adapts to the PDF ─────────── */

function HeroResumeButton() {
  const state = useResumeAvailable();

  if (state === 'ready') {
    return (
      <a className="btn btn--ghost" href={resume.file} download>
        Download Resume
        <LuDownload aria-hidden="true" />
      </a>
    );
  }

  if (state === 'checking') {
    return (
      <button className="btn btn--ghost" disabled>
        Download Resume
      </button>
    );
  }

  return (
    <a
      className="btn btn--ghost"
      href={gmailCompose('Resume request — Muhammad Hashir Khan', 'Hello Hashir,\n\nCould you send me your latest resume?\n\n')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Resume — PDF is being updated, this opens an email request instead"
    >
      Download Resume
      <LuArrowUpRight aria-hidden="true" />
    </a>
  );
}

/* ── CTA — open editorial split: text left, schematic right ─────────── */

function CtaSplit() {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 20 });

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 7);
    rx.set(((e.clientY - rect.top) / rect.height - 0.5) * -6);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="cta-split">
      <div className="cta-split__text">
        <p className="mono-label cta-slab__label" aria-hidden="true">
          <i />
          Next step
          <i />
        </p>
        <h2 className="cta-slab__title">
          Have a repetitive process?
          <br />
          <span className="tx-crimson">Let&rsquo;s automate it.</span>
        </h2>
        <div className="cta-slab__action--row">
          <Link to="/contact" className="btn btn--primary">
            Start a Conversation
            <LuArrowRight aria-hidden="true" />
          </Link>
          <Link to="/services" className="btn btn--ghost">
            View Services
          </Link>
        </div>
      </div>

      <motion.div
        className="cta-split__visual"
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
        onMouseMove={reduce ? undefined : onMove}
        onMouseLeave={reduce ? undefined : onLeave}
        aria-hidden="true"
      >
        <div className="cta-split__frame">
          <ProjectCover kind="pipeline" />
        </div>
        <p className="cta-split__caption mono-label">Fig. 01 — an automated pipeline</p>
      </motion.div>
    </div>
  );
}

/* ── capabilities card inner (shared by coverflow + static grid) ────── */

function CapCardInner({ service }: { service: Service }): ReactNode {
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
