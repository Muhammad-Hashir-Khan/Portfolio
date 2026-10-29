import { useEffect, useState } from 'react';
import { resume } from '../data/portfolio';

export type ResumeState = 'checking' | 'ready' | 'missing';

/**
 * Availability of public/files/resume.pdf, probed with a HEAD request.
 * A missing file falls through to the SPA's index.html (text/html), so a
 * pdf content-type is the reliable "file exists" signal.
 */
export function useResumeAvailable(): ResumeState {
  const [state, setState] = useState<ResumeState>('checking');

  useEffect(() => {
    let cancelled = false;

    fetch(resume.file, { method: 'HEAD' })
      .then((res) => {
        if (cancelled) return;
        const type = res.headers.get('content-type') ?? '';
        setState(res.ok && type.includes('pdf') ? 'ready' : 'missing');
      })
      .catch(() => {
        if (!cancelled) setState('missing');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
