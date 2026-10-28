import { useEffect, useRef, useState } from 'react';
import { LuArrowUpRight, LuExpand, LuMail, LuX } from 'react-icons/lu';
import { projects, type Project } from '../data/portfolio';
import { mailLink, waLink } from '../lib/links';
import ProjectCover from './ProjectCover';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function Projects() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  // wide / narrow editorial rhythm: 01 wide, 02 & 03 narrow, 04 wide
  const spans = ['project-card--wide', '', '', 'project-card--wide'];

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          index="03"
          label="Selected work"
          title={<span id="projects-title">Work &amp; technical demonstrations</span>}
          lead="No clients are invented here. These are clearly labeled technical demonstrations of the automation patterns I build — each one is a full case study below."
        />

        <div className="projects__grid">
          {projects.map((project, i) => (
            <Reveal key={project.id} className={spans[i] ? 'card-wrap ' + spans[i] : 'card-wrap'} delay={(i % 2) * 80}>
              <article
                className="card project-card"
                style={{ height: '100%' }}
                tabIndex={-1}
                aria-label={project.title}
              >
                <div className="project-card__cover">
                  <ProjectCover kind={project.visual} />
                  <span className="project-card__badge">{project.badge}</span>
                </div>

                <div className="project-card__head">
                  <span className="mono-label">{project.index}</span>
                  <span>{project.category}</span>
                </div>

                <h3>{project.title}</h3>
                <p>{project.summary}</p>

                <div className="project-card__foot">
                  <div className="project-card__tech" aria-label="Technologies">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span className="chip" key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="project-card__open"
                    onClick={() => setOpenProject(project)}
                  >
                    Case study
                    <LuExpand aria-hidden="true" />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {openProject && (
        <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      )}
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const sections: Array<{ label: string; text: string }> = [
    { label: '01 · The problem', text: project.details.problem },
    { label: '02 · The workflow', text: project.details.workflow },
    { label: '03 · Automation logic', text: project.details.logic },
    { label: '04 · Systems & APIs', text: project.details.systems },
    { label: '05 · Validation & error handling', text: project.details.validation },
    { label: '06 · Outcome', text: project.details.outcome },
  ];

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={project.title}>
        <div className="modal__head">
          <div>
            <span className="mono-label">
              {project.index} — {project.category}
            </span>
            <h3>{project.title}</h3>
          </div>
          <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Close case study">
            <LuX aria-hidden="true" />
          </button>
        </div>

        <div className="modal__body">
          {sections.map((section) => (
            <div className="modal__section" key={section.label}>
              <h4>{section.label}</h4>
              <p>{section.text}</p>
            </div>
          ))}

          <div className="modal__section">
            <h4>07 · Technologies</h4>
            <div className="service-hero__chips" style={{ margin: 0 }}>
              {project.tech.map((tech) => (
                <span className="chip" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal__foot">
          <p className="muted-note">
            Live demo / source links: not published for these demonstrations — the implementation approach can
            be walked through on request.
          </p>
          <div className="modal__actions">
            <a
              href={waLink(`Hello Hashir — I'd like to discuss "${project.title}" in more detail.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--sm"
            >
              Discuss This Project
              <LuArrowUpRight aria-hidden="true" />
            </a>
            <a href={mailLink(`Question about "${project.title}"`)} className="btn btn--ghost btn--sm">
              <LuMail aria-hidden="true" />
              Email Instead
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
