import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { LuArrowUpRight, LuDownload, LuFileText, LuLinkedin, LuMessageCircle } from 'react-icons/lu';
import { SiFiverr, SiGithub, SiUpwork } from 'react-icons/si';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { opportunities, profile, resume, socialLinks, type SocialId } from '../data/portfolio';
import { mailDefault, waLink } from '../lib/links';
import { spotlight } from '../lib/spotlight';

const CHANNEL_ICONS: Record<SocialId, IconType> = {
  linkedin: LuLinkedin,
  github: SiGithub,
  upwork: SiUpwork,
  fiverr: SiFiverr,
};

export default function ContactPage() {
  return (
    <Page className="contact-page">
      <div className="container page-top">
        <PageHeader
          label="Contact"
          lines={['Direct lines,', <>no <span className="tx-crimson">gatekeepers.</span></>]}
          lead="No forms, no waiting queues — every channel below goes straight to me. Pick whichever you prefer; email and WhatsApp get the fastest reply."
        />
      </div>

      {/* ── Giant email ── */}
      <section className="section contact-email-section" aria-label="Email">
        <div className="container">
          <Reveal>
            <a className="contact-email" href={mailDefault()}>
              <span className="mono-label">Email — click to compose</span>
              <span className="contact-email__address">
                {profile.email}
                <LuArrowUpRight aria-hidden="true" />
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── Channels + resume ── */}
      <section className="section" aria-label="Other channels and resume">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-channels">
              <p className="mono-label">Channels</p>
              <div className="contact-channels__grid">
                <Reveal>
                  <a
                    className="tile spot contact-tile contact-tile--wa"
                    href={waDefaultHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseMove={spotlight}
                  >
                    <LuMessageCircle aria-hidden="true" />
                    <div>
                      <b>WhatsApp</b>
                      <span>{profile.whatsapp.display}</span>
                    </div>
                    <i className="tile__hint mono-label">Opens chat</i>
                  </a>
                </Reveal>

                {socialLinks.map((social) => {
                  const Icon = CHANNEL_ICONS[social.id];
                  return (
                    <Reveal key={social.id}>
                      <a
                        className="tile spot contact-tile"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseMove={spotlight}
                      >
                        <Icon aria-hidden="true" />
                        <div>
                          <b>{social.label}</b>
                          <span>Professional profile</span>
                        </div>
                        <i className="tile__hint mono-label">New tab</i>
                      </a>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            <div className="contact-resume-col">
              <p className="mono-label">Documents</p>
              <Reveal>
                <ResumeButton />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Opportunities ── */}
      <section className="section" aria-label="Opportunities">
        <div className="container">
          <Reveal className="section-head">
            <div className="eyebrow" aria-hidden="true">
              <span className="eyebrow__tick" />
              <span className="eyebrow__label">Open to</span>
              <span className="eyebrow__line" />
            </div>
            <h2 className="section-title">Ways we can work together.</h2>
          </Reveal>

          <div className="opp-list">
            {opportunities.map((opportunity, i) => (
              <Reveal key={opportunity.id} delay={Math.min(i * 0.05, 0.2)}>
                <div className="opp-row">
                  <span className="mono-label opp-row__num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="opp-row__body">
                    <h3>{opportunity.title}</h3>
                    <p>{opportunity.text}</p>
                  </div>
                  <a
                    className="slider__link"
                    href={waLink(opportunity.waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Discuss ${opportunity.title} on WhatsApp`}
                  >
                    Discuss
                    <LuArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}

function waDefaultHref(): string {
  return waLink("Hello Hashir — I found your portfolio and I'd like to connect.");
}

/* ── Resume slot: checks for the PDF, adapts automatically ───────────── */

type ResumeState = 'checking' | 'ready' | 'missing';

function ResumeButton() {
  const [state, setState] = useState<ResumeState>('checking');

  useEffect(() => {
    let cancelled = false;

    fetch(resume.file, { method: 'HEAD' })
      .then((res) => {
        if (cancelled) return;
        const type = res.headers.get('content-type') ?? '';
        // Missing file falls through to the SPA's index.html (text/html),
        // so a pdf content-type is the reliable "file exists" signal.
        setState(res.ok && type.includes('pdf') ? 'ready' : 'missing');
      })
      .catch(() => {
        if (!cancelled) setState('missing');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'ready') {
    return (
      <a className="tile spot resume-row resume-row--ready" href={resume.file} download onMouseMove={spotlight}>
        <LuFileText aria-hidden="true" />
        <div>
          <b>{resume.label}</b>
          <span>PDF · opens the download directly</span>
        </div>
        <span className="resume-row__icon" aria-hidden="true">
          <LuDownload />
        </span>
      </a>
    );
  }

  if (state === 'checking') {
    return (
      <div className="tile resume-row" aria-live="polite">
        <LuFileText aria-hidden="true" />
        <div>
          <b>{resume.label}</b>
          <span>Checking availability…</span>
        </div>
        <span className="pulse-dot" aria-hidden="true" />
      </div>
    );
  }

  return (
    <a className="tile resume-row resume-row--missing" href={mailDefault()} onMouseMove={spotlight}>
      <LuFileText aria-hidden="true" />
      <div>
        <b>Resume coming soon</b>
        <span>Meanwhile, email me and I&rsquo;ll send it directly</span>
      </div>
      <LuArrowUpRight aria-hidden="true" />
    </a>
  );
}
