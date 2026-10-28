import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type SectionHeadingProps = {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
};

/** In-page section heading — mono eyebrow + display title + lead. */
export default function SectionHeading({ label, title, lead, children }: SectionHeadingProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="section-head"
      initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="eyebrow" aria-hidden="true">
        <span className="eyebrow__label">{label}</span>
        <span className="eyebrow__line" />
      </div>
      <h2 className="section-title">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
      {children}
    </motion.div>
  );
}
