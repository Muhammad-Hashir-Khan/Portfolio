// Contact link helpers — no contact form anywhere; direct channels only.

import { profile } from '../data/portfolio';

export function waLink(message: string): string {
  return `https://wa.me/${profile.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function waDefault(): string {
  return waLink(
    `Hello Hashir — I found your portfolio and I'd like to discuss an opportunity.`,
  );
}

export function mailLink(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject });
  if (body) params.set('body', body);
  return `mailto:${profile.email}?${params.toString()}`;
}

export function mailDefault(): string {
  return mailLink(
    'Portfolio contact — Muhammad Hashir Khan',
    'Hello Hashir,\n\nI saw your portfolio and would like to discuss an opportunity.\n\n',
  );
}

/**
 * Gmail compose in a new browser tab — works even when the visitor has no
 * default mail client configured (a plain mailto link can silently do
 * nothing on such machines). Used for all primary "email me" actions.
 */
export function gmailCompose(subject?: string, body?: string): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: profile.email,
  });
  if (subject) params.set('su', subject);
  if (body) params.set('body', body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function gmailDefault(): string {
  return gmailCompose(
    'Portfolio contact — Muhammad Hashir Khan',
    'Hello Hashir,\n\nI saw your portfolio and would like to discuss an opportunity.\n\n',
  );
}
