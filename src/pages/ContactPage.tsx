import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { LuArrowUpRight, LuDownload, LuFileText, LuLinkedin, LuMessageCircle } from 'react-icons/lu';
import { SiFiverr, SiGithub, SiUpwork } from 'react-icons/si';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';
import { opportunities, profile, resume, socialLinks, type SocialId } from '../data/portfolio';
import { gmailCompose, gmailDefault, mailLink, waLink } from '../lib/links';
import { spotlight } from '../lib/spotlight';

const CHANNEL_ICONS: Record<SocialId, IconType> = {
  linkedin: LuLinkedin,
  github: SiGithub,
  upwork: SiUpwork,
  fiverr: SiFiverr,
};

export default function ContactPage({ ready = true }: { ready?: boolean }) {
  return (
    <Page className="contact-page">
      <div className="container page-top">
        <PageHeader
          slit={{ text: 'CONTACT', subtitle: 'START A CONVERSATION' }}
          ready={ready}
          lead="No forms, no waiting queues — every channel below goes straight to me. Pick whichever you prefer; email and WhatsApp get the fastest reply."
        />
      </div>

      {/* ── Email — one line, opens mailbox in a new tab ── */}
      <section className="section contact-email-section" aria-label="Email">
        <div className="container">
          <Reveal className="contact-email-block">
            <p className="mono-label contact-email__label">Email — opens your mailbox in a new tab</p>
            <a
              className="contact-email"
              href={gmailDefault()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-email__address">{profile.email}</span>
              <span className="contact-email__arrow" aria-hidden="true">
                <LuArrowUpRight />
              </span>
            </a>
            <div className="contact-email__alt">
              <a href={mailLink('Portfolio contact — Muhammad Hashir Khan')}>Use default mail app</a>
              <i aria-hidden="true">·</i>
              <CopyEmailButton />
            </div>
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
                    className="tile spot contact-tile"
                    href={waLink("Hello Hashir — I found your portfolio and I'd like to connect.")}
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

/* ── copy-to-clipboard for the address ──────────────────────────────── */

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable (http / permissions) — silently ignore
    }
  };

  return (
    <>
      <button onClick={copy}>Copy address</button>
      <span className={copied ? 'copy-flash copy-flash--on' : 'copy-flash'} role="status">
        {copied ? 'Copied ✓' : ''}
      </span>
    </>
  );
}

/* ── Resume: always a real button — behavior adapts to the file ─────── */

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

  const sub =
    state === 'ready'
      ? 'PDF · downloads directly'
      : state === 'checking'
        ? 'Checking availability…'
        : 'PDF is being updated — clicking sends me an email request';

  if (state === 'ready') {
    return (
      <a className="resume-btn resume-btn--ready" href={resume.file} download>
        <span className="resume-btn__icon" aria-hidden="true">
          <LuFileText />
        </span>
        <span className="resume-btn__text">
          <b>{resume.label}</b>
          <span>{sub}</span>
        </span>
        <span className="resume-btn__action" aria-hidden="true">
          <LuDownload />
        </span>
      </a>
    );
  }

  return (
    <a
      className="resume-btn"
      href={gmailCompose('Resume request — Muhammad Hashir Khan', 'Hello Hashir,\n\nCould you send me your latest resume?\n\n')}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="resume-btn__icon" aria-hidden="true">
        <LuFileText />
      </span>
      <span className="resume-btn__text">
        <b>{resume.label}</b>
        <span>{sub}</span>
      </span>
      <span className="resume-btn__action" aria-hidden="true">
        <LuArrowUpRight />
      </span>
    </a>
  );
}
