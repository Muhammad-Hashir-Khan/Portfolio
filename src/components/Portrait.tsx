import { useState } from 'react';
import { profile } from '../data/portfolio';

/**
 * Profile photograph slot. If public/images/profile.jpg is missing,
 * a clean typographic placeholder is rendered instead (no broken image).
 */
export default function Portrait({ className = '' }: { className?: string }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div className={`hero__fallback ${className}`.trim()} aria-label="Profile photograph placeholder">
        <b>{profile.initials}</b>
        <span>
          Portrait slot — place your photo at
          <br />
          public/images/profile.jpg
        </span>
      </div>
    );
  }

  return (
    <img
      src={profile.portrait}
      alt={`Professional portrait of ${profile.name}`}
      width={480}
      height={600}
      decoding="async"
      onError={() => setMissing(true)}
      className={className || undefined}
    />
  );
}
