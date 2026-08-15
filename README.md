# RinCynar Home

Personal space. Material You-inspired, progressively rendered, built with Vue 3 + Vite.

## Local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Cloudflare Pages

Set these in the project:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** `20` (see `.nvmrc`)

HTML is not cached. Fingerprinted files under `/assets/` are immutable.

## Content

Edit files in `public/content/`:

- `about.md` — about section
- `projects.json` — featured work
- `blog/` — articles
- `interests.json` — Main / Anime
- `interests/` — local posters
- `books.json` — bookshelf

## Workers

`worker/` is deployed separately:

- `github-proxy.js` — GitHub API + 15-minute edge cache
- `music-proxy.js` — playlist proxy
- `email-proxy.js` — contact form
