import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import TransitionIntro, { type IntroPhrase } from './components/TransitionIntro';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
// ProjectsPage is temporarily gated — swap back when the page publishes:
import ProjectsGate from './pages/ProjectsGate';
import SkillsPage from './pages/SkillsPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';

/** the word each route's transition veil tears open */
const PHRASES: Record<string, IntroPhrase> = {
  '/': { text: 'MUHAMMAD HASHIR KHAN', subtitle: 'AI AUTOMATION ENGINEER', fit: true },
  '/about': { text: 'ABOUT', subtitle: 'AI AUTOMATION SPECIALIST' },
  '/services': { text: 'SERVICES', subtitle: 'WHAT I BUILD' },
  '/projects': { text: 'PROJECTS', subtitle: 'SELECTED WORK' },
  '/skills': { text: 'SKILLS', subtitle: 'TOOLS & STACK' },
  '/pricing': { text: 'PRICING', subtitle: 'STARTING POINTS' },
  '/contact': { text: 'CONTACT', subtitle: 'START A CONVERSATION' },
};

export default function App() {
  const location = useLocation();

  // page content stays unmounted (behind the veil) until the slit intro ends
  const [routeReady, setRouteReady] = useState(false);
  const [phrase, setPhrase] = useState<IntroPhrase | null>(
    () => PHRASES[location.pathname] ?? PHRASES['/'],
  );
  const prevPath = useRef<string | null>(null);

  // Route change: jump to top instantly (before the new page enters).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  // Route change: open a blank veil carrying the destination page's word.
  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = location.pathname;
      return;
    }
    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;
    setRouteReady(false);
    setPhrase(PHRASES[location.pathname] ?? PHRASES['/']);
  }, [location.pathname]);

  return (
    <>
      {phrase && (
        <TransitionIntro
          key={phrase.text}
          phrase={phrase}
          onReveal={() => setRouteReady(true)}
          onDone={() => setPhrase(null)}
        />
      )}

      <Nav />

      {routeReady && (
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage ready={routeReady} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<ProjectsGate />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      )}

      <Footer />
      <Chatbot />
    </>
  );
}
