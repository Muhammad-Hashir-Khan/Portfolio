import type { MouseEvent } from 'react';

/**
 * Cursor spotlight — writes --mx / --my CSS vars used by the .spot
 * radial-gradient overlay. Pure transform-free, GPU-cheap.
 */
export function spotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
}
