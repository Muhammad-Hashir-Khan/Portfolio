import { useState, type MouseEvent as ReactMouseEvent } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { profile } from '../data/portfolio';

/**
 * Profile photograph in a 3D glass frame — cursor tilt, floating glass
 * orbs and a light sheen. If public/images/profile.jpg is missing, a
 * clean typographic placeholder is rendered instead (no broken image).
 */
export default function Portrait() {
  const [missing, setMissing] = useState(false);
  const reduce = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 20 });

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 9);
    rx.set(((e.clientY - rect.top) / rect.height - 0.5) * -7);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  if (missing) {
    return (
      <figure className="glass-portrait">
        <div className="hero__fallback" aria-label="Profile photograph placeholder">
          <b>{profile.initials}</b>
          <span>
            Portrait slot — place your photo at
            <br />
            public/images/profile.jpg
          </span>
        </div>
      </figure>
    );
  }

  return (
    <motion.figure
      className="glass-portrait"
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={reduce ? undefined : onMove}
      onMouseLeave={reduce ? undefined : onLeave}
    >
      <span className="glass-portrait__orb glass-portrait__orb--a" aria-hidden="true" />
      <span className="glass-portrait__orb glass-portrait__orb--b" aria-hidden="true" />
      <img
        src={profile.portrait}
        alt={`Professional portrait of ${profile.name}`}
        width={480}
        height={600}
        decoding="async"
        onError={() => setMissing(true)}
        className="glass-portrait__img"
      />
      <span className="glass-portrait__sheen" aria-hidden="true" />
    </motion.figure>
  );
}
