import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import Portrait from '../components/Portrait';
import { profile, processStages } from '../data/portfolio';

export default function AboutPage() {
  return (
    <Page className="about">
      <div className="container page-top">
        <PageHeader
          label="About"
          lines={['The engineer', 'behind the systems.']}
          lead={
            <>
              I&rsquo;m Muhammad Hashir Khan — an <span className="tx-crimson">AI Automation Engineer</span> focused on
              turning repetitive, rule-heavy operations into intelligent workflows that businesses can trust.
            </>
          }
        />
      </div>

      {/* ── Profile ── */}
      <section className="section" aria-label="Profile">
        <div className="container about__grid">
          <Reveal className="about__portrait-col">
            <div className="about__portrait">
              <Portrait />
            </div>
            <div className="about__portrait-meta">
              <b>{profile.name}</b>
              <span className="tx-crimson">{profile.title}</span>
              <span className="muted">{profile.location}</span>
            </div>
          </Reveal>

          <div className="about__body">
            {profile.bio.map((para, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <p className="about__para">{para}</p>
              </Reveal>
            ))}

            <Reveal delay={0.12}>
              <div className="about__capabilities">
                <p className="mono-label">What I do</p>
                <ul>
                  {profile.capabilities.map((cap, i) => (
                    <li key={cap}>
                      <i>{String(i + 1).padStart(2, '0')}</i>
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Working method ── */}
      <section className="section" aria-label="Working method">
        <div className="container">
          <SectionHeading
            label="Working method"
            title="From bottleneck to running system."
            lead="Six stages keep every engagement predictable — and every automation honest about what it does."
          />

          <div className="process-grid">
            {processStages.map((stage, i) => (
              <Reveal key={stage.index} delay={(i % 2) * 0.06}>
                <div className="process-row">
                  <span className="process-row__index" aria-hidden="true">
                    {stage.index}
                  </span>
                  <div className="process-row__body">
                    <h3>{stage.title}</h3>
                    <p>{stage.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
