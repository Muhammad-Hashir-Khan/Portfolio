import { processStages } from '../data/portfolio';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function Workflow() {
  return (
    <section className="section" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading
          index="05"
          label="Process"
          title={<span id="process-title">From complex problems to practical solutions.</span>}
          lead="A six-stage process designed so non-technical clients always know what is happening, what comes next, and what is being delivered."
        />

        <div className="process">
          {processStages.map((stage, i) => (
            <Reveal key={stage.index} delay={i * 90} className="process-stage-wrap">
              <article className="card process-stage" style={{ height: '100%' }}>
                <span className="process-stage__node" aria-hidden="true" />
                <span className="process-stage__index">Stage {stage.index}</span>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
