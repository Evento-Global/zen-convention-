# Security

## What this repository is

- **Static frontend only** (Vite + React). No server, no REST/GraphQL API, no Swagger/OpenAPI, no admin panel.
- **No GCP / Cloud Run / Docker deploy** artifacts in this repo.
- `src/` does **not** read `import.meta.env` or `process.env` — nothing from `.env` is bundled today.
- Public decor prices in `src/data/galleryRates.ts` are intentional site content.

## What is not in this repo

| Risk | Status |
|------|--------|
| `.env` with secrets | Gitignored — never commit |
| Service account JSON | Gitignored (`*credentials*`, `.gcp/`, `.gcloud/`) |
| API keys in source | Not used; run `make security-check` before push |
| Swagger / backend routes | Not implemented |

## Before you push to GitHub

```bash
git status                    # confirm no .env, keys, or price screenshot folders
make security-check
make ci
```

Optional: `rg -i "api[_-]?key|secret|password|token|BEGIN PRIVATE" --glob '!node_modules'`

## After deploy (live)

```bash
make live-security-check LIVE_URL=https://zen-convention.vercel.app
```

Probes `/`, `/api`, `/swagger`, `/.env`, etc. A static host may return the SPA `index.html` for unknown paths (HTTP 200) — that is **not** a live API; there is no server to abuse. Confirm responses do not contain private keys or env values.

## Hosting

- Deploy **`dist/`** only (`npm run build`).
- Put any future secrets in the **host dashboard**, never in git.
- Do not prefix secrets with `VITE_` — Vite exposes those to the browser bundle.

## Reporting

Contact Evento Global maintainers privately if you find exposed credentials on a deployed URL.
