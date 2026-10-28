import { LuArrowUpRight, LuShieldCheck } from 'react-icons/lu';
import { services } from '../data/portfolio';
import { waLink } from '../lib/links';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function Services() {
  const featured = services.find((s) => s.featured) ?? services[0];
  const rest = services.filter((s) => s !== featured);

  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHeading
          index="02"
          label="Services"
          title={<span id="services-title">What I build</span>}
          lead="AI automation is the core of every engagement. The other services support it when your project needs more than automation alone."
        />

        {/* FEATURED — AI Automation Development */}
        <Reveal className="service-hero-wrap" delay={80}>
          <article className="card service-hero">
            <div className="service-hero__top">
              <span className="mono-label">Service {featured.index}</span>
              <span className="service-hero__badge">Primary specialization</span>
            </div>
            <h3>{featured.name}</h3>
            <p className="service-hero__desc">{featured.description}</p>

            <div className="service-hero__chips" aria-label="Included capabilities">
              {featured.capabilities.map((cap) => (
                <span className="chip" key={cap}>
                  {cap}
                </span>
              ))}
            </div>

            <div className="service-hero__foot">
              <div className="price-tag">
                <i>Starting from</i>
                <b>${featured.price}</b> USD
              </div>
              <a href={waLink(featured.waMessage)} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                Discuss This Service
                <LuArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </article>
        </Reveal>

        {/* Secondary services as editorial rows */}
        <div className="service-row-list">
          {rest.map((service, i) => (
            <Reveal key={service.id} delay={Math.min(i * 60, 240)}>
              <a
                className="service-row"
                href={waLink(service.waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${service.name} — starting from $${service.price} — discuss on WhatsApp`}
              >
                <span className="service-row__index">{service.index}</span>
                <span className="service-row__body">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  {service.note && <span className="service-row__note">{service.note}</span>}
                </span>
                <span className="service-row__price">
                  FROM <b>${service.price}</b> USD
                </span>
                <span className="service-row__cta" aria-hidden="true">
                  <LuArrowUpRight />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="services__note">
            <LuShieldCheck style={{ verticalAlign: '-2px', color: 'var(--crimson)', marginRight: 6 }} aria-hidden="true" />
            Honest note: I only claim capabilities I can demonstrate. Scope, stack and deliverables are agreed
            per project — nothing is promised that isn&rsquo;t in the written plan.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
