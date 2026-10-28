import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LuArrowUpRight, LuPlus } from 'react-icons/lu';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { pricing, services } from '../data/portfolio';
import { waLink } from '../lib/links';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PricingPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <Page className="pricing-page">
      <div className="container page-top">
        <PageHeader
          label="Pricing"
          lines={['Starting points,', <>not <span className="tx-crimson">ceilings.</span></>]}
          lead="No locked tiers, no packaged boxes — just a clear starting number per service line, and an exact quote once the scope is understood."
        />

        <Reveal className="price-meta" delay={0.15}>
          <span>{services.length} services</span>
          <i aria-hidden="true" />
          <span>{pricing.currency}</span>
          <i aria-hidden="true" />
          <span>Starting prices</span>
          <i aria-hidden="true" />
          <span>Scope-based quotes</span>
        </Reveal>
      </div>

      {/* ── Unboxed price index ── */}
      <section className="section" aria-label="Starting prices">
        <div className="container">
          <div className="price-list">
            {services.map((service, i) => {
              const open = openId === service.id;
              return (
                <Reveal key={service.id} delay={Math.min(i * 0.04, 0.2)}>
                  <div className={open ? 'price-row price-row--open' : 'price-row'}>
                    <button
                      className="price-row__head"
                      onClick={() => setOpenId(open ? null : service.id)}
                      aria-expanded={open}
                      aria-controls={`price-panel-${service.id}`}
                    >
                      <span className="price-row__price" aria-label={`Starting from ${pricing.currency} ${service.price}`}>
                        <i>$</i>
                        <b>{service.price}</b>
                      </span>

                      <span className="price-row__name">
                        <span className="mono-label">{service.index}</span>
                        <b>{service.name}</b>
                        {service.note && <span className="price-row__note">{service.note}</span>}
                      </span>

                      <span className="price-row__toggle" aria-hidden="true">
                        <LuPlus />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={`price-panel-${service.id}`}
                          className="price-row__panel"
                          initial={reduce ? undefined : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                        >
                          <div className="price-row__panel-inner">
                            <p>{service.description}</p>

                            <ul className="chip-list">
                              {service.capabilities.map((cap) => (
                                <li className="chip" key={cap}>
                                  {cap}
                                </li>
                              ))}
                            </ul>

                            <a
                              className="btn btn--ghost btn--sm price-row__cta"
                              href={waLink(service.waMessage)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Discuss scope on WhatsApp
                              <LuArrowUpRight aria-hidden="true" />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="pricing__disclaimer" delay={0.1}>
            <p className="mono-label">How quotes work</p>
            <p>{pricing.disclaimer}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Editorial CTA slab (no box) ── */}
      <section className="cta-slab" aria-label="Get a quote">
        <div className="container cta-slab__inner">
          <Reveal className="cta-slab__text">
            <p className="mono-label">Exact number</p>
            <h2>
              Tell me the scope.
              <br />
              <span className="tx-crimson">Get a fixed quote.</span>
            </h2>
            <p className="cta-slab__sub">
              A short conversation is enough for me to map the work and return a written, fixed quote — no
              estimates that drift, no surprise invoices.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="cta-slab__action">
            <a
              className="btn btn--primary"
              href={waLink('Hello Hashir — I want a quote for a project. Here is the scope:')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request a Quote
              <LuArrowUpRight aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
