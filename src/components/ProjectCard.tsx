import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import type { Project } from '../data/portfolio';
import { spotlight } from '../lib/spotlight';
import ProjectCover from './ProjectCover';

type ProjectCardProps = {
  project: Project;
  wide?: boolean;
  action: ReactNode;
};

/**
 * VIP project card — cursor spotlight, ghost index watermark, cover zoom,
 * lift on hover. `action` is the footer CTA (router link or modal button).
 */
export default function ProjectCard({ project, wide, action }: ProjectCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={wide ? 'card spot project-card project-card--wide' : 'card spot project-card'}
      onMouseMove={spotlight}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      aria-label={project.title}
    >
      <span className="project-card__ghost" aria-hidden="true">
        {project.index}
      </span>

      <div className="project-card__cover">
        <div className="project-card__cover-zoom">
          <ProjectCover kind={project.visual} />
        </div>
        <span className="project-card__badge">{project.badge}</span>
      </div>

      <div className="project-card__body">
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
          {action}
        </div>
      </div>
    </motion.article>
  );
}
