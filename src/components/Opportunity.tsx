import { LuArrowUpRight, LuHandshake, LuGlobe, LuBuilding2, LuUsers } from 'react-icons/lu';
import { opportunities } from '../data/portfolio';
import { waLink } from '../lib/links';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const opportunityIcons = [LuGlobe, LuBuilding2, LuUsers, LuHandshake];

export default function Opportunity() {
  return (
    <section className="section" id="opportunities" aria-labelledby="opportunities-title">
      <div className="container">
        <SectionHeading
          index="09"
          label="Opportunities"
          title={<span id="opportunities-title">Let&rsquo;s build something meaningful.</span>}
          lead="I'm interested in opportunities where intelligent automation, software development and practical problem-solving create meaningful value."
        />

        <div className="opp__grid">
          {opportunities.map((opp, i) => {
            const Icon = opportunityIcons[i] ?? LuGlobe;
            return (
              <Reveal key={opp.id} delay={i * 70}>
                <article className="card opp-card" style={{ height: '100%' }}>
                  <Icon style={{ width: 22, height: 22, color: 'var(--crimson)' }} aria-hidden="true" />
                  <span className="mono-label">Path {String(i + 1).padStart(2, '0')}</span>
                  <h3>{opp.title}</h3>
                  <p>{opp.text}</p>
                  <a
                    href={waLink(opp.waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost btn--sm"
                  >
                    Reach out
                    <LuArrowUpRight aria-hidden="true" />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
