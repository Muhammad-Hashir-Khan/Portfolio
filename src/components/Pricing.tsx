import { useRef, useState } from 'react';
import { LuArrowUpRight, LuChevronLeft, LuChevronRight, LuInfo, LuMail } from 'react-icons/lu';
import { pricing, services } from '../data/portfolio';
import { mailLink, waLink } from '../lib/links';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

export default function Pricing() {
  const [index, setIndex] = useState(0);
  const pointerX = useRef<number | null>(null);

  const active = services[index];
  const last = services.length - 1;

  const go = (dir: 1 | -1) => {
    setIndex((i) => Math.min(Math.max(i + dir, 0), last));
  };

  return (
    <section className="section" id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <SectionHeading
          index="06"
          label="Pricing"
          title={
            <span id="pricing-title">
              Premium work, <span className="tx-crimson">transparent starting points</span>
            </span>
          }
          lead="Select a service to see what is included and where the conversation starts."
        />

        <Reveal className="pricing-shell-wrap" delay={60}>
          <div className="card pricing__shell">
            {/* service rail */}
            <div
              className="pricing__rail"
              role="tablist"
              aria-label="Pricing services"
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  go(1);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  go(-1);
                }
              }}
            >
              {services.map((service, i) => (
                <button
                  key={service.id}
                  className="pricing__num"
                  role="tab"
                  aria-selected={i === index}
                  aria-current={i === index ? 'true' : undefined}
                  aria-label={service.name}
                  onClick={() => setIndex(i)}
                >
                  {service.index}
                </button>
              ))}
            </div>

            {/* stage — swipeable, keyboard reachable, no hypnotic autoplay */}
            <div
              className="pricing__stage"
              aria-live="polite"
              style={{ touchAction: 'pan-y' }}
              onPointerDown={(e) => {
                pointerX.current = e.clientX;
              }}
              onPointerUp={(e) => {
                if (pointerX.current === null) return;
                const delta = e.clientX - pointerX.current;
                pointerX.current = null;
                if (delta < -44) go(1);
                else if (delta > 44) go(-1);
              }}
            >
              <div className="price-panel" key={active.id}>
                <div className="price-panel__anim">
                  <div className="price-panel__left">
                    <span className="price-panel__cat">SERVICE {active.index} / {String(last + 1).padStart(2, '0')}</span>
                    <h3 className="price-panel__name">{active.name}</h3>
                    <div className="price-panel__amount">
                      <span className="from">From</span>
                      <span className="value">
                        $<b>{active.price}</b>
                      </span>
                      <span className="cur">USD · STARTING PRICE</span>
                    </div>
                  </div>

                  <div className="price-panel__right">
                    <p className="price-panel__desc">{active.description}</p>

                    <div className="price-panel__chips" aria-label="Typical scope">
                      {active.capabilities.map((cap) => (
                        <span className="chip" key={cap}>
                          {cap}
                        </span>
                      ))}
                    </div>

                    {active.note && (
                      <p className="price-panel__note">
                        <LuInfo aria-hidden="true" />
                        {active.note}
                      </p>
                    )}

                    <div className="price-panel__cta">
                      <a
                        href={waLink(active.waMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--primary"
                      >
                        Discuss This Service
                        <LuArrowUpRight aria-hidden="true" />
                      </a>
                      <a
                        href={mailLink(`Service inquiry — ${active.name} (starting from $${active.price})`)}
                        className="btn btn--ghost btn--sm"
                      >
                        <LuMail aria-hidden="true" />
                        Email instead
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* controls */}
            <div className="pricing__controls">
              <div className="pricing__progress" aria-hidden="true">
                {services.map((service, i) => (
                  <i className={i === index ? 'on' : ''} key={service.id} />
                ))}
              </div>

              <div className="pricing__arrows">
                <button className="icon-btn" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous service">
                  <LuChevronLeft aria-hidden="true" />
                </button>
                <button
                  className="icon-btn"
                  onClick={() => go(1)}
                  disabled={index === last}
                  aria-label="Next service"
                >
                  <LuChevronRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="pricing__disclaimer">
            <LuInfo aria-hidden="true" />
            <p>{pricing.disclaimer}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
