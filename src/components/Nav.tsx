import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LuMenu, LuX } from 'react-icons/lu';
import { profile } from '../data/portfolio';
import WelcomeStrip from './WelcomeStrip';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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
        <WelcomeStrip />
        <div className="container nav__inner">
          <Link to="/" className="nav__brand" aria-label={`${profile.name} — ${profile.title}, home`}>
            <b>{profile.name}</b>
            <span>{profile.title}</span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

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
          style={{ position: 'absolute', top: 'calc(var(--strip-h) + var(--nav-h) / 2 - 22px)', right: 'var(--gutter)', display: 'inline-flex' }}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <LuX aria-hidden="true" />
        </button>

        {NAV_LINKS.map((link, i) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            ref={i === 0 ? firstLinkRef : undefined}
            className={({ isActive }) =>
              isActive
                ? 'mobile-menu__link mobile-menu__link--active'
                : 'mobile-menu__link'
            }
            style={{ transitionDelay: open ? `${0.06 + i * 0.05}s` : '0s' }}
            onClick={() => setOpen(false)}
          >
            <i>{String(i + 1).padStart(2, '0')}</i>
            {link.label}
          </NavLink>
        ))}

        <div className="mobile-menu__foot">
          <p className="mono-label" style={{ letterSpacing: '0.2em' }}>
            {profile.title}
          </p>
        </div>
      </div>
    </>
  );
}
