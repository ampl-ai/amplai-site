# ampl-ai by dalsson — site

Static marketing site with a Claude-powered chatbot. Deployed on Vercel.

## Stack

- Plain HTML + inline-Babel React (no build step)
- One Vercel Edge Function at `api/chat.js` proxying Anthropic's API
- The browser never sees the API key

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel, **Import Project** → pick the repo → leave the framework preset as **Other**. No build command, no output dir.
3. Under **Settings → Environment Variables**, add:

   | Key                  | Value                              |
   |----------------------|------------------------------------|
   | `ANTHROPIC_API_KEY`  | `sk-ant-...` from console.anthropic.com |
   | `ALLOWED_ORIGIN`     | `https://ampl-ai.com` (optional, locks CORS) |
   | `ANTHROPIC_MODEL`    | `claude-haiku-4-5` (optional)      |

4. Deploy. The chatbot will hit `/api/chat` on the same origin — no CORS issues.

## Local dev

```
cp .env.example .env.local
# fill in ANTHROPIC_API_KEY
npx vercel dev
```

`vercel dev` serves the static files and runs the Edge function locally on
http://localhost:3000.

## Files

- `index.html` — page shell + Babel + script tags
- `chrome.jsx` — Nav, Footer
- `hero.jsx` — animated headline (canvas)
- `sections.jsx` — Services, Process, Pillars, Quote, About, Contact
- `chatbot.jsx` — floating Claude assistant
- `app.jsx` — page router
- `styles.css` — design tokens + components
- `api/chat.js` — server proxy to Anthropic (the secret-keeper)

## Cost / safety notes

The Edge function caps each request at 1024 output tokens and trims history
to the last 30 messages. For tighter control, add rate-limiting (Vercel KV +
IP-based throttle) before going wide.
