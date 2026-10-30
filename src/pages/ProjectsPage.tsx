import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LuArrowUpRight, LuX } from 'react-icons/lu';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import CoverflowSlider from '../components/CoverflowSlider';
import ProjectCover from '../components/ProjectCover';
import { projects, type Project } from '../data/portfolio';

const BLOCKS: Array<{ key: keyof Project['details']; label: string }> = [
  { key: 'problem', label: 'The problem' },
  { key: 'workflow', label: 'The workflow' },
  { key: 'logic', label: 'The logic' },
  { key: 'systems', label: 'Systems involved' },
  { key: 'validation', label: 'Validation & safety' },
  { key: 'outcome', label: 'Status' },
];

/** The three documented case studies shown in the 3D carousel. */
/* the three case studies in the carousel — numbered sequentially 01/02/03
   (the raw `projects` data indexes the full portfolio list, 01–04) */
const SLIDER_PROJECTS: Project[] = [projects[0], projects[2], projects[3]].map(
  (project, i) => ({ ...project, index: String(i + 1).padStart(2, '0') }),
);

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
