# Muhammad Hashir Khan — AI Automation Developer · Portfolio

A cinematic, production-ready portfolio in the **Obsidian × Crimson** identity — React + TypeScript + Vite, with a **secure server-side Gemini chatbot** (the API key never reaches the browser).

---

## 1 · Features

| Area | What's included |
| --- | --- |
| Intro | Skippable masked-name reveal + crimson progress bar (auto-suppressed for reduced-motion users) |
| Hero | Word-mask headline choreography, portrait composition, subtle scroll parallax, availability chip |
| Problem | "Less repetitive work, more intelligent execution" editorial grid |
| Services | Featured AI Automation panel + 7 editorial service rows with starting prices & WhatsApp CTAs |
| Projects | 4 honestly-labeled technical demonstrations with schematic covers + full case-study modals |
| Skills | Honest categories — no fake percentage bars |
| Process | Six-stage Discover → Improve rail |
| Pricing | Interactive service rail (buttons, swipe, keyboard) with animated price panel — WhatsApp CTA per service |
| Automation demo | Play/pause/reset pipeline simulation, clearly labeled *illustrative* |
| About / Opportunities / Contact | Verified facts only, 4 opportunity CTAs, NO contact form anywhere |
| Chatbot | Gemini-powered assistant, fact-locked system prompt, rate limiting, retry, graceful offline fallback |
| SEO | Open Graph, canonical, JSON-LD Person, robots.txt, sitemap.xml, semantic headings |

## 2 · Quick start (local)

```bash
cd Desktop\mhk-portfolio

# one time
npm install

# development — API server (8787) + Vite dev server (5173) together
npm run dev
# → open http://localhost:5173

# OR production-style local run
npm run build
npm run start
# → open http://localhost:8787
```

`.env` is already created locally with the Gemini key — **never commit it**.

## 3 · Environment variables

| Variable | Where it's read | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | **Server-side only** (`api/_lib/chat.mjs`) — local via `.env`, on Vercel via dashboard | The Gemini key; never bundled into frontend code |
| `GEMINI_MODEL` | Server-side | Model id. Default `gemini-flash-lite-latest` (alias that auto-tracks the newest available lite model). Verified working with your key: `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`, `gemini-flash-lite-latest`. Heavier flash models (`gemini-3.8-flash`, `gemini-3.5-flash`) were returning `503 high demand` at testing time — they work, just congested at peak |
| `PORT` | `server.mjs` | Local server port (default 8787) |

## 4 · The chatbot architecture (security)

```
Visitor → React chat UI → POST /api/chat (validated)
        → server-side function  ← GEMINI_API_KEY stays here
        → Gemini API (fact-locked system prompt)
        → validated reply → chat UI
```

Implemented in `api/_lib/chat.mjs` (shared by the local server **and** the Vercel function `api/chat.js`):

- Input validation: message string 1–2000 chars, history ≤ 24 turns / 4000 chars each
- Per-IP in-memory rate limit: **10 requests / minute** (verified: 11th request → HTTP 429)
- 60 s upstream timeout → friendly "service busy" message
- Unknown facts → the assistant is hard-instructed to say *"not provided"* (verified live)
- No visitor content is logged

## 5 · Editable content

Everything personal lives in **`src/data/portfolio.ts`**: name, bio, availability, services + prices, projects, skills, contact links, chatbot suggestions. The chatbot's fact file is **`api/_lib/facts.mjs`** — keep it in sync when you edit data.

**Your photograph:** drop your portrait at `public/images/profile.jpg` (portrait ≥ 70% quality), then `npm run build`. Until then a typographic monogram placeholder shows automatically.

## 6 · Deployment (recommended: Vercel)

Vercel runs both the static build **and** the serverless function — required, because a static-only host cannot keep the Gemini key private.

```bash
# one-time
npm i -g vercel
vercel login

# from the project folder
vercel            # preview
vercel --prod     # production
```

1. Vercel auto-detects Vite (no config needed). The `api/` folder becomes a serverless function.
2. Open **Project → Settings → Environment Variables** and add:
   - `GEMINI_API_KEY` (your production key)
   - optional `GEMINI_MODEL`
3. Redeploy once after adding variables.
4. Update `index.html` canonical/OG URLs and `public/robots.txt` + `public/sitemap.xml` with your final domain.

### GitHub publishing

```bash
git init
git add .
git commit -m "Portfolio: initial release"
git branch -M main
git remote add origin https://github.com/Muhammad-Hashir-Khan/portfolio.git
git push -u origin main
```

(Or "Import repository" → point at your local folder; `.gitignore` already excludes `.env`, `node_modules`, `dist`.)
Then in Vercel: **Add New Project → Import Git Repository** — every push auto-deploys.

### Custom domain

Vercel → Project → Settings → Domains → follow the DNS instructions (A / CNAME records at your registrar). HTTPS is automatic.

## 7 · Costs & limits (truthful)

- **Vercel Hobby (free)**: includes serverless function usage — generous for a portfolio, but not guaranteed unlimited forever; the paid plan is cheap if a client site ever outgrows it.
- **Gemini free tier**: includes per-day request limits and per-minute rate limits; **the free tier can change terms at any time**. A paid key (pay-per-token, pennies per 1000) removes soft caps if traffic grows.
- No analytics or tracking services are included — zero third-party data flows beyond the chatbot's own messages.

## 8 · Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| Chat says *"assistant is not configured"* | `GEMINI_API_KEY` missing server-side — set it in `.env` locally or in the Vercel dashboard |
| Chat says *"service busy (peak demand)"* | Free-tier model saturation (verified behavior). Wait a minute, or set `GEMINI_MODEL=gemini-3.5-flash-lite` |
| `401/403` in server logs | Key rotated/invalid — regenerate at aistudio.google.com/apikey and update the server-side env |
| `npm run dev` shows no chat replies | The API server (8787) must be running — `npm run dev` starts both; or run `npm run dev:api` separately |
| Need to verify the key quickly | `node scripts/debug-gemini.mjs` |
| Portrait shows monogram | Expected until `public/images/profile.jpg` exists |

## 9 · What was actually tested (no claims beyond this)

- `tsc -b` type-check: **pass**
- `vite build` production build: **pass** (JS 298 kB → 91 kB gzip, CSS 83 kB → 31 kB gzip)
- Local server (build preview): `GET /` 200 + name present · favicon · robots.txt · sitemap.xml · SPA fallback 200
- `GET /api/chat` → **405** (method guard correct)
- Empty message → **400** · 2500-char message → **400** (validation correct)
- Live Gemini round-trip through the local server → **200 + fact-bound reply** (verified twice)
- Honesty guard: "which university did he attend?" → *"has not been provided… reach him via email or WhatsApp"* — no invention
- Rate limiting: burst of 12 → `10× 200, then 2× 429`

Not yet done: Lighthouse runs (not available in this environment) and visual browser screenshots — open the sites listed above to review the design on your machine.

## 10 · Project structure

```
mhk-portfolio/
├─ index.html              # SEO shell
├─ public/                 # favicon, robots, sitemap, images/profile.jpg slot
├─ api/
│  ├─ chat.js              # Vercel serverless function
│  └─ _lib/                # shared handler + fact file (local + Vercel)
├─ scripts/dev.mjs         # runs API + Vite together
├─ scripts/debug-gemini.mjs# key/model diagnostics
├─ server.mjs              # local static + API server
├─ src/
│  ├─ data/portfolio.ts    # ← EDIT ALL CONTENT HERE
│  ├─ lib/                 # links + chat client
│  ├─ styles/              # tokens / base / layout / sections / chatbot
│  └─ components/          # 16 components (Nav, Hero, Services, …, Chatbot)
├─ .env                    # local secrets (git-ignored)
└─ .env.example            # placeholder template
```
