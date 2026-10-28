// Debug v3 — one cheap probe per candidate model: which one is available RIGHT NOW?
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;
const base = 'https://generativelanguage.googleapis.com/v1beta';
const headers = { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' };

const candidates = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
];

const probe = async (model) => {
  const start = Date.now();
  let controller;
  try {
    controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);
    const res = await fetch(`${base}/models/${model}:generateContent`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }] }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await res.json();
    const text = (data?.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('').trim();
    console.log(`${model.padEnd(26)} HTTP ${res.status} in ${Date.now() - start}ms → "${text.slice(0, 30)}"${res.status !== 200 ? ' | ' + (data?.error?.message ?? '').slice(0, 90) : ''}`);
  } catch (err) {
    console.log(`${model.padEnd(26)} FAILED in ${Date.now() - start}ms → ${err?.message || err}`);
  }
};

for (const m of candidates) {
  await probe(m);
}
