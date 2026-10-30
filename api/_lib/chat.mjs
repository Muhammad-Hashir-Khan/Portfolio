// ── Shared chat handler (used by: Vercel function api/chat.js AND local
//    server server.mjs). Guests never touch the Gemini key: requests come
//    here → validated → Gemini API → validated reply → back to the UI. ───

import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './facts.mjs';

const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY = 24;
const MAX_PART_CHARS = 4000;

// Best-effort in-memory rate limiting (per server instance).
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const hits = new Map();

function pruneHits(now) {
  if (hits.size < 500) return;
  for (const [key, entry] of hits) {
    if (entry.resetAt < now) hits.delete(key);
  }
}

function allowRequest(ip) {
  const now = Date.now();
  pruneHits(now);
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_REQUESTS_PER_WINDOW;
}

function parseBody(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'INVALID_INPUT' };
  }

  const message = typeof raw.message === 'string' ? raw.message.trim() : '';
  if (message.length < 1 || message.length > MAX_MESSAGE_CHARS) {
    return { ok: false, error: 'INVALID_INPUT' };
  }

  const history = Array.isArray(raw.history)
    ? raw.history.slice(-MAX_HISTORY).flatMap((item) => {
        if (!item || typeof item !== 'object') return [];
        const role =
          item.role === 'user' ? 'user' : item.role === 'assistant' ? 'model' : null;
        if (!role) return [];
        const text = typeof item.text === 'string' ? item.text.slice(0, MAX_PART_CHARS) : '';
        if (!text) return [];
        return [{ role, parts: [{ text }] }];
      })
    : [];

  return { ok: true, message, history };
}

async function callGemini({ message, history }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured server-side.');
    err.code = 'CONFIG_MISSING';
    throw err;
  }

  const model = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  const ai = new GoogleGenAI({ apiKey });

  // Latency notes: cap the output (most of the generation time is the
  // reply length) and keep temperature low so answers stay on-topic
  // instead of meandering into generic filler.
  const response = await ai.models.generateContent({
    model,
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.35,
      maxOutputTokens: 300,
      abortSignal: AbortSignal.timeout(45_000),
    },
  });

  const reply = (response?.text ?? '').trim();
  if (!reply) {
    const err = new Error('Empty upstream response.');
    err.code = 'UPSTREAM';
    throw err;
  }
  return reply;
}

function errorPayload(code) {
  switch (code) {
    case 'INVALID_INPUT':
      return { status: 400, message: 'Please send a short question (1–2000 characters).' };
    case 'CONFIG_MISSING':
      return {
        status: 500,
        message:
          'The AI assistant is not configured on this deployment. You can always reach Hashir directly via email or WhatsApp.',
      };
    case 'RATE_LIMIT':
      return {
        status: 429,
        message: 'The assistant is receiving a lot of requests right now. Please try again in a minute.',
      };
    case 'UPSTREAM_LIMIT':
      return {
        status: 502,
        message: 'The AI service is rate-limited at the moment. Please retry in a little while.',
      };
    case 'UPSTREAM_BUSY':
      return {
        status: 503,
        message:
          'The AI service is busy right now (peak demand). Please try again shortly — or email Hashir directly in the meantime.',
      };
    default:
      return { status: 502, message: 'The AI service is temporarily unavailable. Please try again shortly.' };
  }
}

export async function handleChatRequest({ method, body, ip = 'unknown' }) {
  if (method !== 'POST') {
    return { status: 405, payload: { error: 'METHOD_NOT_ALLOWED', message: 'Use POST for /api/chat.' } };
  }

  if (!allowRequest(ip)) {
    return { status: 429, payload: { error: 'RATE_LIMIT', ...errorPayload('RATE_LIMIT') } };
  }

  const parsed = parseBody(body);
  if (!parsed.ok) {
    return { status: 400, payload: { error: 'INVALID_INPUT', ...errorPayload('INVALID_INPUT') } };
  }

  try {
    const reply = await callGemini(parsed);
    // Never log visitor message content.
    return { status: 200, payload: { reply } };
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      console.error('[chat] upstream timed out');
      const payload = errorPayload('UPSTREAM_BUSY');
      return { status: payload.status, payload: { error: 'UPSTREAM_BUSY', message: payload.message } };
    }
    const rawMessage = String(err?.message ?? '');
    if (err?.status === 503 || err?.httpStatus === 503 || /503|UNAVAILABLE|high demand/i.test(rawMessage)) {
      console.error('[chat] upstream busy (high demand)');
      const payload = errorPayload('UPSTREAM_BUSY');
      return { status: payload.status, payload: { error: 'UPSTREAM_BUSY', message: payload.message } };
    }
    const code = err?.code || (err?.status === 429 ? 'UPSTREAM_LIMIT' : 'UPSTREAM');
    // Log minimal metadata only — no message content, no secrets.
    console.error('[chat] request failed:', code, err?.status ?? err?.httpStatus ?? '');
    const payload = errorPayload(code);
    return { status: payload.status, payload: { error: code, message: payload.message } };
  }
}
