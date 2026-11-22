# ViSi0N PORTFOLIO

Pola Bahaa's interactive front-end portfolio: projects, journey and skills, in English and Arabic.

Live preview: https://polabahaa.github.io/ViSi0N-PORTFOLIO/

## Stack

- React 18 + TypeScript
- Vite
- No UI framework — hand-written CSS in `src/style.css`

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs static site to dist/
```

## Deploy

Every push to `main` builds and deploys to GitHub Pages through
`.github/workflows/deploy.yml`. To restore an earlier version of the site,
revert to that commit (or re-run the workflow from an older commit) — the git
history is the version history.
