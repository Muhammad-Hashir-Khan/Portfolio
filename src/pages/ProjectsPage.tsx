import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LuArrowUpRight, LuX } from 'react-icons/lu';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import ProjectCard from '../components/ProjectCard';
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

      {/* ── Project grid ── */}
      <section className="section" aria-label="All projects">
        <div className="container">
          <div className="projects__grid">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={Math.min(i * 0.06, 0.2)} className={i === 0 ? 'projects__span2' : undefined}>
                <ProjectCard
                  project={project}
                  wide={i === 0}
                  action={
                    <button className="project-card__open" onClick={() => setActive(project)}>
                      Read case study
                      <LuArrowUpRight aria-hidden="true" />
                    </button>
                  }
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live proof strip ── */}
      <section className="section" aria-label="Live demonstration">
        <div className="container">
          <Reveal className="projects__live">
            <div>
              <p className="mono-label">Live demonstration</p>
              <p className="projects__live-text">
                The second case study isn&rsquo;t a write-up — it runs on this site. Open the assistant in the corner
                and question it: it answers strictly from verified profile facts through a server-side, key-protected
                endpoint.
              </p>
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
