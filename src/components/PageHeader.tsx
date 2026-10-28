import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  label: string;
  /** each entry renders as one masked line; use <span className="tx-crimson"> for emphasis */
  lines: ReactNode[];
  /** supporting paragraph under the title */
  lead?: ReactNode;
};

const LINE_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial page opening: mono label, then line-by-line masked title
 * reveal, then the lead paragraph.
 */
export default function PageHeader({ label, lines, lead }: PageHeaderProps) {
  const reduce = useReducedMotion();

  return (
    <header className="page-header">
      <motion.div
        className="eyebrow"
        initial={reduce ? false : { opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: LINE_EASE }}
        aria-hidden="true"
      >
        <span className="eyebrow__label">{label}</span>
        <span className="eyebrow__line" />
      </motion.div>

      <h1 className="page-header__title">
        {lines.map((line, i) => (
          <span className="line-mask" key={i}>
            <motion.span
              className="line-inner"
              initial={reduce ? false : { y: '112%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.08 + i * 0.09, ease: LINE_EASE }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      {lead && (
        <motion.p
          className="page-header__lead"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 + lines.length * 0.09, ease: LINE_EASE }}
        >
          {lead}
        </motion.p>
      )}
    </header>
  );
}
