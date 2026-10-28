import type { ReactNode } from 'react';
import Reveal from './Reveal';

type SectionHeadingProps = {
  index: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
};

export default function SectionHeading({ index, label, title, lead, children }: SectionHeadingProps) {
  return (
    <Reveal className="section-head">
      <div className="eyebrow" aria-hidden="true">
        <span className="eyebrow__tick" />
        <span className="eyebrow__index">{index}</span>
        <span className="eyebrow__label">{label}</span>
        <span className="eyebrow__line" />
      </div>
      <h2 className="section-title">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
      {children}
    </Reveal>
  );
}
