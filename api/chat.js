// Vercel serverless function: POST /api/chat
// The Gemini API key lives ONLY in the Vercel environment variable
// GEMINI_API_KEY — never in the React bundle.

import { handleChatRequest } from './_lib/chat.mjs';

export default async function handler(req, res) {
  const forwarded = typeof req.headers['x-forwarded-for'] === 'string' ? req.headers['x-forwarded-for'] : '';
  const ip = forwarded.split(',')[0].trim() || 'unknown';

  const result = await handleChatRequest({
    method: req.method,
    body: req.body ?? {},
    ip,
  });

  res.status(result.status).json(result.payload);
}
