# ViSi0N PORTFOLIO

Pola Bahaa's interactive full-stack portfolio: projects, journey and skills, in English and Arabic.

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


## Public repository sync

The project grid fetches all public repositories from the unauthenticated GitHub API on each page load and once per hour while the page stays open. A Refresh control is available too. Pagination supports more than 100 repositories. New public repositories appear automatically; deleted or newly private repositories disappear after a successful sync. Only public repositories ever appear on the page.

No GitHub credentials are shipped to visitors. If GitHub is offline or its unauthenticated rate limit is reached, the grid keeps the last available snapshot and shows an explicit warning. The build includes a public-only fallback snapshot in `src/repos-snapshot.json`.
