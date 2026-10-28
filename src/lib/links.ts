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
