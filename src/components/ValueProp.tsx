import type { ComponentType } from 'react';
import type { IconType } from 'react-icons';
import { LuBell, LuDatabase, LuPlug, LuRepeat, LuWorkflow, LuZap } from 'react-icons/lu';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

interface Benefit {
  index: string;
  title: string;
  text: string;
  icon: IconType;
}

const BENEFITS: Benefit[] = [
  {
    index: '01',
    title: 'Less routine',
    text: 'Repetitive manual tasks move from people to well-designed automation, freeing attention for work that actually needs judgement.',
    icon: LuRepeat,
  },
  {
    index: '02',
    title: 'Connected systems',
    text: 'Applications talk to each other through APIs and webhooks instead of through copy-paste and re-typing.',
    icon: LuPlug,
  },
  {
    index: '03',
    title: 'Cleaner data',
    text: 'Information is validated and structured where it enters the system — not patched together afterwards.',
    icon: LuDatabase,
  },
  {
    index: '04',
    title: 'Consistent execution',
    text: 'Workflows run the same way every time, with logs you can trace — fewer exceptions, fewer silent failures.',
    icon: LuWorkflow,
  },
  {
    index: '05',
    title: 'AI inside operations',
    text: 'Practical AI integrated into existing tools and processes — working infrastructure, not a demo video.',
    icon: LuZap,
  },
  {
    index: '06',
    title: 'Quiet automation',
    text: 'Notifications, reports and routine business processes handled automatically in the background.',
    icon: LuBell,
  },
];

export default function ValueProp() {
  return (
    <section className="section" id="problem" aria-labelledby="problem-title">
      <div className="container">
        <SectionHeading
          index="01"
          label="The problem"
          title={
            <span id="problem-title">
              Less repetitive work. <span className="tx-crimson">More intelligent execution.</span>
            </span>
          }
          lead="Well-designed automation-connectable systems can change how a business operates day to day. These are the effects my work aims for when a solution is properly implemented:"
        />

        <div className="value__grid">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon as ComponentType<{ className?: string }>;
            return (
              <Reveal key={benefit.index} delay={(i % 3) * 90} className="value__item-wrap">
                <article className="value__item" style={{ height: '100%' }}>
                  <span className="mono-label">{benefit.index}</span>
                  <Icon className="value__icon" aria-hidden="true" />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="value__foot">
            Every proposed solution starts from your actual process — no automation for its own sake, and no
            promise of results that can&rsquo;t be verified on the way.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
