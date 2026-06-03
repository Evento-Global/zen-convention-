# Security

## What this repository is

- **Static frontend only** (Vite + React). There is **no server**, **no REST API**, **no GraphQL**, and **no Swagger/OpenAPI** surface in this codebase.
- Nothing in `src/` reads `import.meta.env` or `process.env` at runtime today.
- Listed decor prices live in `src/data/galleryRates.ts` (intended to be public on the site).

## Before you push to GitHub

1. Never commit `.env`, keys, or credential JSON — covered by `.gitignore`.
2. Run `git status` and confirm no `.env` or `*credentials*` files are staged.
3. Optional audit: `rg -i "api[_-]?key|secret|password|token|BEGIN PRIVATE" --glob '!node_modules'` from repo root.

## Hosting (Vercel, Netlify, GitHub Pages)

- Deploy **`dist/`** only after `npm run build`.
- Set any future secrets in the **host dashboard**, not in the repo.
- Use `vercel.json` / `public/_headers` in this repo for baseline security headers on static hosts.
- There are no admin routes to lock down; abuse surface is limited to **public static files**.

## Reporting

Contact Evento Global maintainers privately if you find a misconfiguration on a deployed URL.
