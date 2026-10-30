import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

import IntroOverlay from './components/IntroOverlay';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [booted, setBooted] = useState(false);
  const location = useLocation();

  // Route change: jump to top instantly (before the new page enters).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <>
      {!booted && <IntroOverlay onDone={() => setBooted(true)} />}

      <Nav />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage ready={booted} />} />
          <Route path="/about" element={<AboutPage ready={booted} />} />
          <Route path="/services" element={<ServicesPage ready={booted} />} />
          <Route path="/projects" element={<ProjectsPage ready={booted} />} />
          <Route path="/skills" element={<SkillsPage ready={booted} />} />
          <Route path="/pricing" element={<PricingPage ready={booted} />} />
          <Route path="/contact" element={<ContactPage ready={booted} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <Footer />
      <Chatbot />
    </>
  );
}
