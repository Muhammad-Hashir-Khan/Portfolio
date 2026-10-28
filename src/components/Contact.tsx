import type { IconType } from 'react-icons';
import { LuArrowUpRight, LuLinkedin, LuMail, LuMessageCircle } from 'react-icons/lu';
import { SiFiverr, SiGithub, SiUpwork } from 'react-icons/si';
import { socialLinks, type SocialId } from '../data/portfolio';
import { mailDefault, waDefault } from '../lib/links';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const BRAND_ICONS: Record<SocialId, IconType> = {
  linkedin: LuLinkedin,
  github: SiGithub,
  upwork: SiUpwork,
  fiverr: SiFiverr,
};

export default function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading
          index="10"
          label="Contact"
          title={
            <span id="contact-title">
              Let&rsquo;s start the <span className="tx-crimson">conversation.</span>
            </span>
          }
          lead="No contact form — email and WhatsApp reach me directly, so your message is never lost in a queue."
        />

        <div className="contact__channels">
          <Reveal>
            <a className="card contact-channel" href={mailDefault()} style={{ height: '100%' }}>
              <span className="contact-channel__icon" aria-hidden="true">
                <LuMail />
              </span>
              <span className="contact-channel__body">
                <h3>Email</h3>
                <p>muhammadhashirkhan.official@gmail.com</p>
              </span>
              <span className="contact-channel__go" aria-hidden="true">
                <LuArrowUpRight />
              </span>
            </a>
          </Reveal>

          <Reveal delay={70}>
            <a
              className="card contact-channel"
              href={waDefault()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ height: '100%' }}
            >
              <span className="contact-channel__icon" aria-hidden="true">
                <LuMessageCircle />
              </span>
              <span className="contact-channel__body">
                <h3>WhatsApp</h3>
                <p>+92 312 2347665 · opens with a prefilled message</p>
              </span>
              <span className="contact-channel__go" aria-hidden="true">
                <LuArrowUpRight />
              </span>
            </a>
          </Reveal>
        </div>

        <div className="contact__social">
          {socialLinks.map((social, i) => {
            const Icon = BRAND_ICONS[social.id];
            return (
              <Reveal key={social.id} delay={i * 60}>
                <a
                  className="card social-card"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} profile (opens in a new tab)`}
                  style={{ height: '100%' }}
                >
                  <Icon aria-hidden="true" />
                  <b>{social.label}</b>
                  <span aria-hidden="true">
                    <LuArrowUpRight />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="contact__note">
            <span className="refusal">No forms · No tracking pixels</span> — direct channels only, repeated in the
            footer for convenience.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
