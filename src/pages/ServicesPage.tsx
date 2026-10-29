import { LuArrowUpRight } from 'react-icons/lu';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { services } from '../data/portfolio';
import { waLink } from '../lib/links';
import { spotlight } from '../lib/spotlight';

export default function ServicesPage() {
  return (
    <Page className="services">
      <div className="container page-top">
        <PageHeader
          label="Services"
          lines={
            [
              'Capabilities engineered',
              <>around your <span className="tx-crimson">operations.</span></>,
            ]
          }
          lead="Eight service lines, one mindset: systems that remove busywork and behave predictably. Every engagement starts from your actual process — not a template."
        />
      </div>

      {/* ── Service index ── */}
      <section className="section" aria-label="All services">
        <div className="container">
          <div className="service-list">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={Math.min(i * 0.05, 0.25)}>
                <article className="service-row">
                  <div className="service-row__index mono-label">{service.index}</div>

                  <div className="service-row__main">
                    <h3>
                      {service.name}
                      {service.featured && <span className="tag-crimson">Core</span>}
                    </h3>
                    <p>{service.description}</p>
                    {service.note && <p className="service-row__note">{service.note}</p>}
                  </div>

                  <div className="service-row__caps" aria-label={`${service.name} capabilities`}>
                    {service.capabilities.slice(0, 4).map((cap) => (
                      <span className="chip" key={cap}>
                        {cap}
                      </span>
                    ))}
                    {service.capabilities.length > 4 && (
                      <span className="chip chip--more">+{service.capabilities.length - 4} more</span>
                    )}
                  </div>

                  <div className="service-row__side">
                    <span className="service-row__price">
                      FROM <b>${service.price}</b>
                    </span>
                    <a
                      className="slider__link"
                      href={waLink(service.waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Discuss ${service.name} on WhatsApp`}
                    >
                      Discuss
                      <LuArrowUpRight aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How pricing works ── */}
      <section className="section" aria-label="Pricing note">
        <div className="container">
          <Reveal>
            <div className="note-band spot" onMouseMove={spotlight}>
              <div className="note-band__lead">
                <p className="mono-label">A note on pricing</p>
                <p className="note-band__statement">
                  Fixed, written scope — <span className="tx-crimson">before any work begins.</span>
                </p>
              </div>
              <p className="note-band__body">
                Each line shows a <b>starting price</b>. Real quotes depend on scope, integrations and
                delivery requirements — after a short conversation, you get a fixed, written scope before
                any work begins.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
