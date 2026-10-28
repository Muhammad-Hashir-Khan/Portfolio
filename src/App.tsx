import { useState } from 'react';

import IntroOverlay from './components/IntroOverlay';
import Nav from './components/Nav';
import Hero from './components/Hero';
import ValueProp from './components/ValueProp';
import Services from './components/Services';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Workflow from './components/Workflow';
import Pricing from './components/Pricing';
import AutomationDemo from './components/AutomationDemo';
import About from './components/About';
import Opportunity from './components/Opportunity';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {!booted && <IntroOverlay onDone={() => setBooted(true)} />}
      <Nav />
      <main>
        <Hero ready={booted} />
        <ValueProp />
        <Services />
        <Projects />
        <Skills />
        <Workflow />
        <Pricing />
        <AutomationDemo />
        <About />
        <Opportunity />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

export const reduceMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
