// Chat client for /api/chat — never touches the Gemini key (server-side only).

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

export class ChatError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'ChatError';
    this.code = code;
  }
}

export function clientErrorMessage(code: string): string {
  switch (code) {
    case 'RATE_LIMIT':
      return 'The assistant is receiving a lot of requests right now — please try again in a minute.';
    case 'CONFIG_MISSING':
      return 'The AI assistant is not configured on this deployment. You can reach Hashir directly by email or WhatsApp.';
    case 'UPSTREAM_LIMIT':
      return 'The AI service is rate-limited at the moment. Please retry in a little while.';
    case 'UPSTREAM_BUSY':
      return 'The AI service is busy right now (peak demand) — please try again shortly, or email Hashir directly in the meantime.';
    case 'INVALID_INPUT':
      return 'That message was too long for the assistant — try a shorter question.';
    default:
      return 'The AI service is temporarily unavailable. You can still email Hashir or message him on WhatsApp.';
  }
}

export async function sendChat(message: string, history: ChatTurn[]): Promise<string> {
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history
          .filter((m) => (m as ChatTurn & { error?: boolean }).error !== true)
          .slice(-16)
          .map((m) => ({ role: m.role, text: m.text })),
      }),
    });
  } catch {
    throw new ChatError('NETWORK', clientErrorMessage('NETWORK'));
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON error body */
  }

  const payload = (data ?? {}) as { reply?: unknown; error?: unknown };
  if (!res.ok || typeof payload.reply !== 'string' || !payload.reply.trim()) {
    const code = typeof payload.error === 'string' ? payload.error : 'UPSTREAM';
    throw new ChatError(code, clientErrorMessage(code));
  }
  return payload.reply.trim();
}
