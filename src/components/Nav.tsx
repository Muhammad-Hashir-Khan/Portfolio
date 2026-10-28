import { useEffect, useRef, useState } from 'react';
import { LuArrowUpRight, LuMenu, LuX } from 'react-icons/lu';
import { profile } from '../data/portfolio';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (typeof IntersectionObserver === 'undefined' || sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-38% 0px -56% 0px', threshold: 0 },
    );
    sections.forEach((sec) => io.observe(sec));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('no-scroll');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    firstLinkRef.current?.focus();

    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
      burgerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header className={scrolled ? 'nav nav--scrolled' : 'nav'}>
        <div className="container nav__inner">
          <a href="#home" className="nav__brand" aria-label={`${profile.name} — ${profile.title}, back to top`}>
            <b>{profile.name}</b>
            <span>{profile.title}</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="nav__link"
                aria-current={active === link.id ? 'true' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#contact" className="btn btn--primary nav__cta">
            Let&rsquo;s Discuss an Opportunity
            <LuArrowUpRight aria-hidden="true" />
          </a>

          <button
            ref={burgerRef}
            className="nav__burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(true)}
          >
            <LuMenu aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={open ? 'mobile-menu mobile-menu--open' : 'mobile-menu'}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <button
          className="nav__burger"
          style={{ position: 'absolute', top: 'calc(var(--nav-h) / 2 - 22px)', right: 'var(--gutter)', display: 'inline-flex' }}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <LuX aria-hidden="true" />
        </button>

        {NAV_LINKS.map((link, i) => (
          <a
            key={link.id}
            ref={i === 0 ? firstLinkRef : undefined}
            href={`#${link.id}`}
            className="mobile-menu__link"
            style={{ transitionDelay: open ? `${0.06 + i * 0.05}s` : '0s' }}
            onClick={() => setOpen(false)}
          >
            <i>{String(i + 1).padStart(2, '0')}</i>
            {link.label}
          </a>
        ))}

        <div className="mobile-menu__foot">
          <a href="#contact" className="btn btn--primary" onClick={() => setOpen(false)}>
            Let&rsquo;s Discuss an Opportunity
            <LuArrowUpRight aria-hidden="true" />
          </a>
          <p className="mono-label" style={{ letterSpacing: '0.2em' }}>
            {profile.title}
          </p>
        </div>
      </div>
    </>
  );
}
