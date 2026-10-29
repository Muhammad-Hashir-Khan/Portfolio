import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LuArrowUpRight, LuMessagesSquare, LuX } from 'react-icons/lu';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import CoverflowSlider from '../components/CoverflowSlider';
import ProjectCover from '../components/ProjectCover';
import { chatbot, projects, type Project } from '../data/portfolio';
import { spotlight } from '../lib/spotlight';

const BLOCKS: Array<{ key: keyof Project['details']; label: string }> = [
  { key: 'problem', label: 'The problem' },
  { key: 'workflow', label: 'The workflow' },
  { key: 'logic', label: 'The logic' },
  { key: 'systems', label: 'Systems involved' },
  { key: 'validation', label: 'Validation & safety' },
  { key: 'outcome', label: 'Status' },
];

/** The three documented case studies shown in the 3D carousel. */
const SLIDER_PROJECTS = [projects[0], projects[2], projects[3]];

/** Project 02 — this website's assistant, featured as the live proof. */
const LIVE_PROJECT = projects[1];

/** Assistant guarantees, distilled from the case-study details. */
const PROOF_POINTS = [
  'The API key never leaves the server.',
  'Answers are limited to the verified fact file.',
  'Per-IP rate limiting and history trimming keep usage sane.',
  'A graceful offline fallback points to direct channels.',
];

export default function ProjectsPage() {
  const [active, setActive] = useState<Project | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const reduce = useReducedMotion();

  // modal lifecycle: Esc to close, scroll lock, focus the close button
  useEffect(() => {
    if (!active) return;

    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [active]);

  const openAssistant = () => {
    window.dispatchEvent(new Event('mhk:open-chat'));
  };

  return (
    <Page className="projects-page">
      <div className="container page-top">
        <PageHeader
          label="Projects"
          lines={['Work, documented', <>honestly<span className="tx-crimson">.</span></>]}
          lead="Every case study below is a clearly labeled technical demonstration — architecture, logic and safety design written out in full. No invented clients, no fabricated metrics."
        />
      </div>

      {/* ── 3D case-study carousel ── */}
      <CoverflowSlider
        items={SLIDER_PROJECTS}
        itemKey={(project) => project.id}
        renderItem={(project) => <ProjectSlideBody project={project} onOpen={() => setActive(project)} />}
        heading={
          <Reveal className="section-head">
            <div className="eyebrow" aria-hidden="true">
              <span className="eyebrow__label">Case studies</span>
              <span className="eyebrow__line" />
            </div>
            <h2 className="section-title">
              Three builds, <span className="tx-crimson">in depth.</span>
            </h2>
            <p className="section-lead">
              Rotate through the demonstrations — the active card opens its full case study.
            </p>
          </Reveal>
        }
        ariaLabel="Projects carousel"
      />

      {/* ── Live proof of work ── */}
      <section className="section" aria-label="Live demonstration">
        <div className="container">
          <Reveal>
            <div className="proof spot" onMouseMove={spotlight}>
              <div className="proof__main">
                <p className="mono-label proof__label">Live demonstration</p>
                <h2 className="proof__title">{LIVE_PROJECT.title}</h2>
                <p className="proof__text">
                  The second case study isn&rsquo;t a write-up — it runs on this site. Open the assistant in
                  the corner and question it: it answers strictly from verified profile facts through a
                  server-side, key-protected endpoint.
                </p>
                <div className="proof__row">
                  <button className="btn btn--primary" onClick={openAssistant}>
                    Open the assistant
                    <LuMessagesSquare aria-hidden="true" />
                  </button>
                  <button className="project-card__open" onClick={() => setActive(LIVE_PROJECT)}>
                    Read case study
                    <LuArrowUpRight aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="proof__side">
                <div className="proof__console">
                  <div className="proof__console-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>assistant · live</span>
                  </div>
                  <ul className="proof__points">
                    {PROOF_POINTS.map((point) => (
                      <li key={point}>
                        <span className="proof__tick" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="proof__hint mono-label">
                    Try: &ldquo;{chatbot.suggestions[2]}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Case study modal ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="project-modal"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActive(null)}
            role="presentation"
          >
            <motion.div
              className="project-modal__panel"
              role="dialog"
              aria-modal="true"
              aria-label={`${active.title} — case study`}
              initial={reduce ? undefined : { y: 44, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeRef}
                className="project-modal__close"
                onClick={() => setActive(null)}
                aria-label="Close case study"
              >
                <LuX aria-hidden="true" />
              </button>

              <div className="project-modal__cover">
                <ProjectCover kind={active.visual} />
                <span className="project-card__badge">{active.badge}</span>
              </div>

              <div className="project-modal__body">
                <p className="mono-label">{active.category}</p>
                <h3>{active.title}</h3>
                <p className="project-modal__summary">{active.summary}</p>

                <div className="chip-list">
                  {active.tech.map((tech) => (
                    <span className="chip" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>

                <dl className="project-modal__blocks">
                  {BLOCKS.map((block) => (
                    <div className="project-modal__block" key={block.key}>
                      <dt className="mono-label">{block.label}</dt>
                      <dd>{active.details[block.key]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}

/* ── card body inside the 3D carousel ───────────────────────────────── */

function ProjectSlideBody({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <>
      <div className="cap-slide__cover" aria-hidden="true">
        <ProjectCover kind={project.visual} />
      </div>

      <span className="mono-label">{project.category}</span>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>

      <div className="cap-card__foot">
        <button className="slider__link" onClick={onOpen}>
          Read case study
          <LuArrowUpRight aria-hidden="true" />
        </button>
        <span className="cap-slide__index mono-label" aria-hidden="true">
          {project.index}
        </span>
      </div>
    </>
  );
}
