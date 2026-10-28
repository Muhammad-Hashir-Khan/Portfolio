import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { LuArrowUp, LuLinkedin, LuMail, LuMessageCircle } from 'react-icons/lu';
import { SiFiverr, SiGithub, SiUpwork } from 'react-icons/si';
import { profile, socialLinks, type SocialId } from '../data/portfolio';
import { mailDefault, waDefault } from '../lib/links';

const BRAND_ICONS: Record<SocialId, IconType> = {
  linkedin: LuLinkedin,
  github: SiGithub,
  upwork: SiUpwork,
  fiverr: SiFiverr,
};

const FOOTER_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'pricing', label: 'Pricing' },
];

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const backToTop = () => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <b>{profile.name}</b>
              <span>{profile.title}</span>
              <p>
                Intelligent workflows, practical AI integration and business process automation — built for
                teams that want measurable, verifiable systems.
              </p>
            </div>

            <div className="footer__col">
              <h4>Direct channels</h4>
              <ul>
                <li>
                  <a href={mailDefault()}>
                    <LuMail aria-hidden="true" />
                    {profile.email}
                  </a>
                </li>
                <li>
                  <a href={waDefault()} target="_blank" rel="noopener noreferrer">
                    <LuMessageCircle aria-hidden="true" />
                    WhatsApp {profile.whatsapp.display}
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__col">
              <h4>Profiles &amp; pages</h4>
              <ul>
                {socialLinks.map((social) => {
                  const Icon = BRAND_ICONS[social.id];
                  return (
                    <li key={social.id}>
                      <a href={social.href} target="_blank" rel="noopener noreferrer">
                        <Icon aria-hidden="true" style={{ width: 15, height: 15 }} />
                        {social.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <ul>
                {FOOTER_LINKS.map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer__bottom">
            <p>
              © {new Date().getFullYear()} {profile.name} — Portfolio &amp; credentials updated regularly
            </p>
            <button className="footer__top-btn" onClick={backToTop}>
              Back to top
              <LuArrowUp aria-hidden="true" />
            </button>
          </div>
        </div>
      </footer>

      <button
        className={showTop ? 'footer__backtotop footer__backtotop--show' : 'footer__backtotop'}
        onClick={backToTop}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
      >
        <LuArrowUp aria-hidden="true" />
      </button>
    </>
  );
}
