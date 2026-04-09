# Amplai Website — ampl-ai.com

## Quick Deploy (15 minutes)

### Step 1: Install dependencies locally
```bash
npm install
```

### Step 2: Test locally (optional)
```bash
npm run dev
# Opens at http://localhost:3000
```

### Step 3: Push to GitHub
```bash
# If you don't have a GitHub account, create one at github.com

# Create a new repository on GitHub:
# Go to github.com/new → Name it "amplai-site" → Keep it private → Create

# Then in your terminal:
git init
git add .
git commit -m "Initial launch of ampl-ai.com"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/amplai-site.git
git push -u origin main
```

### Step 4: Deploy on Vercel
1. Go to **vercel.com** and sign up with your GitHub account
2. Click **"Add New Project"**
3. Select your **amplai-site** repository
4. Click **"Deploy"** — Vercel auto-detects Next.js and configures everything
5. Wait ~60 seconds. Your site is now live at `amplai-site.vercel.app`

### Step 5: Connect your domain (ampl-ai.com)
1. In Vercel, go to your project → **Settings** → **Domains**
2. Type `ampl-ai.com` and click **Add**
3. Vercel will show you DNS records to add. Go to your domain registrar (Namecheap, etc.) and add:

| Type  | Name | Value                  |
|-------|------|------------------------|
| A     | @    | 76.76.21.21            |
| CNAME | www  | cname.vercel-dns.com   |

4. Wait 5–30 minutes for DNS propagation
5. Vercel automatically provisions an SSL certificate (https)
6. Your site is now live at **https://ampl-ai.com**

### Step 6: Enable live AI chatbot (optional)
1. Get an API key from **console.anthropic.com**
2. In Vercel: **Settings** → **Environment Variables**
3. Add: `ANTHROPIC_API_KEY` = `sk-ant-...`
4. Redeploy (Vercel auto-redeploys when env vars change)
5. The chatbot now uses live AI instead of demo responses

## Project Structure
```
amplai-site/
├── app/
│   ├── layout.js          # Root layout with SEO metadata
│   ├── page.js            # Homepage (all sections)
│   ├── globals.css         # Styles + responsive breakpoints
│   ├── components/
│   │   └── Chatbot.js     # Chat widget (demo + live mode)
│   └── api/
│       └── chat/
│           └── route.js   # API proxy for Anthropic (server-side)
├── public/                 # Static assets (add favicon, images here)
├── package.json
├── next.config.js
└── .env.example           # Copy to .env.local for local dev
```

## Making Changes
Edit any file, commit, and push to GitHub. Vercel auto-deploys on every push.

```bash
git add .
git commit -m "Updated homepage copy"
git push
# Live in ~30 seconds
```

## Adding Pages
Create new files in `app/` directory:
- `app/demo/page.js` → ampl-ai.com/demo
- `app/blog/page.js` → ampl-ai.com/blog
- `app/about/page.js` → ampl-ai.com/about

## Support
Built by Amplai. For questions: hello@ampl-ai.com
