import { LuInfo } from 'react-icons/lu';
import { skillCategories, skillsNote } from '../data/portfolio';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function Skills() {
  const featured = skillCategories.find((c) => c.featured);
  const rest = skillCategories.filter((c) => c !== featured);

  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          index="04"
          label="Technical skills"
          title={
            <span id="skills-title">
              Capabilities, <span className="tx-crimson">honestly stated</span>
            </span>
          }
          lead="No fake percentage bars and no invented expertise levels — just categories of what I actually work with."
        />

        <div className="skills__grid">
          {featured && (
            <Reveal className="skill-panel--featured">
              <article className="skill-panel" style={{ height: '100%' }}>
                <div className="skill-panel__head">
                  <h3>{featured.title}</h3>
                  <span className="mono-label">Core</span>
                </div>
                <ul>
                  {featured.items.map((item, i) => (
                    <li key={item}>
                      <i>{String(i + 1).padStart(2, '0')}</i>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          )}

          {rest.map((category, i) => (
            <Reveal key={category.title} delay={Math.min(i * 70, 210)}>
              <article className="card skill-panel" style={{ height: '100%' }}>
                <div className="skill-panel__head">
                  <h3>{category.title}</h3>
                  <span className="mono-label">{String(rest.indexOf(category) + 1).padStart(2, '0')}</span>
                </div>
                <ul>
                  {category.items.map((item, j) => (
                    <li key={item}>
                      <i>{String(j + 1).padStart(2, '0')}</i>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="skills__note">
            <LuInfo aria-hidden="true" />
            {skillsNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
