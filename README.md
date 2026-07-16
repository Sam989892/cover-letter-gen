# Cover letters that don't sound like a robot

Paste a job description and your background, pick a tone, and watch a tailored cover letter stream in live. One-click copy or download as .txt.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · Claude API (`@anthropic-ai/sdk`, streaming) · Zod · Lucide

## What it shows

| Skill | Where |
|-------|-------|
| Streaming AI output | `app/api/generate/route.ts` — Claude's response is piped chunk-by-chunk through a `ReadableStream`, and the client renders it token-by-token as it arrives |
| Prompt engineering | `lib/prompt.ts` — a system prompt with anti-AI-tell rules (banned phrases, varied rhythm, no fabrication) plus three tone presets |
| Input validation | `lib/schema.ts` — Zod schema validated server-side, first issue returned as the error message |
| Robust API | Keyless-server guard, typed SDK error handling (auth / rate limit / API), clean JSON errors |
| UX detail | Streaming cursor, copy-with-confirmation, .txt download, disabled states |

## Run it

```bash
npm install
cp .env.local.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev                        # http://localhost:3000
```

## Deploy (Vercel)

Import the repo at [vercel.com](https://vercel.com) and set `ANTHROPIC_API_KEY` in the project's environment variables.

## Resume bullets

- Built a streaming AI cover-letter writer in Next.js 16 + TypeScript: Claude's
  output is piped through a ReadableStream and rendered token-by-token, with
  Zod-validated inputs and tone presets driven by prompt engineering
- Designed the system prompt to eliminate common AI-writing tells (banned
  phrases, varied sentence rhythm, strict no-fabrication rules)

---

Concept project — designed & built by Saiyed (Sam) Madni. I use it for my own applications.
