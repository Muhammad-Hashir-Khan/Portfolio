import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import Page from '../components/Page';

const NOTICE =
  'This page is temporarily unavailable due to ongoing updates. Please check back soon!';

/**
 * Temporary gate for the Projects page: the real page is not rendered.
 * Visitors see a blurred, redacted panel with an eye icon in the center —
 * clicking it shows a themed notification at the top of the screen.
 * (The ProjectsPage component stays in the codebase and comes back here
 * once the page is ready to publish again.)
 */
export default function ProjectsGate() {
  const [notice, setNotice] = useState(false);
  const timer = useRef(0);

  const notify = () => {
    setNotice(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(false), 5200);
  };

  // never leave the timer running after unmount
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <Page className="projects-page">
      <div className="pgate">
        <div className="pgate__panel">
          {/* redacted, blurred placeholder content behind the eye */}
          <div className="pgate__blur" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>

          <button
            type="button"
            className={`pgate__eye${notice ? ' pgate__eye--on' : ''}`}
            onClick={notify}
            aria-label="Projects page is temporarily hidden — click for status"
          >
            <LuEye aria-hidden="true" />
            <LuEyeOff aria-hidden="true" />
          </button>

          <p className="pgate__label" aria-hidden="true">
            Projects
          </p>
          <p className="pgate__hint" aria-hidden="true">
            temporarily hidden — click the eye
          </p>
        </div>
      </div>

      <AnimatePresence>
        {notice && (
          <motion.div
            className="pgate__notice"
            role="status"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {NOTICE}
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
