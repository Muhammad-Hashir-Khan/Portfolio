import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import type { Project } from '../data/portfolio';
import { spotlight } from '../lib/spotlight';
import ProjectCover from './ProjectCover';

type ProjectCardProps = {
  project: Project;
  action: ReactNode;
};

/**
 * VIP project card — pointer-tracked 3D tilt, cursor spotlight, ghost index
 * watermark, cover zoom, lift on hover. `action` is the footer CTA.
 */
export default function ProjectCard({ project, action }: ProjectCardProps) {
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 22 });

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    spotlight(e);
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 8);
    rx.set(py * -7);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      className="card spot project-card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={reduce ? undefined : { y: -6 }}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
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
