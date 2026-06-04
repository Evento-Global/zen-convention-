# Evento Global — Celebrations (Zen Convention)

Static **Vite + React + TypeScript** site: hero, seven celebration flip-cards, product-style galleries, INR pricing, and a full-screen lightbox.

**There is no backend in this repository** — no API routes, no Swagger, no database, no server-side secrets.

---

## Quick start (one command)

```bash
make
```

1. Frees common dev ports (see `DEV_PORTS` in the `Makefile`)
2. Starts Vite at **http://localhost:5173**

Other useful targets: `make help` · `make dev` (skip port kill) · `make build` · `make check-ports`

---

## Requirements

| Item | Detail |
|------|--------|
| Node.js | **20.x** — `nvm use` (`.nvmrc`) |
| npm | `package-lock.json` committed |

---

## Project structure

```
.
├── .github/workflows/ci.yml   # push/PR: npm ci + build (no secrets)
├── public/
│   ├── brand/                 # Zen Convention SVG logos (from `zen convention logo:s/`)
│   ├── _headers               # Netlify security headers (copied to dist)
│   └── photos → ../photos     # symlink — required for /photos/… URLs
├── photos/                    # event imagery (scanned at build/dev)
├── scripts/
│   ├── generate-photo-manifest.mjs
│   └── dedupe-photos.mjs      # optional maintenance (not run automatically)
├── src/
│   ├── components/            # Hero, SectionCard, Lightbox
│   ├── data/                  # sections, manifest, galleryRates, mediaUrls
│   ├── pages/                 # HomePage, ProductGalleryPage
│   ├── styles/responsive.css
│   └── utils/pricing.ts
├── .env.example               # template only — no secrets
├── SECURITY.md
├── Makefile
├── vercel.json                # SPA rewrite + security headers (Vercel)
├── index.html
├── package.json
└── vite.config.ts
```

Local-only (gitignored): `.env`, `Zen convention rate /`, `zen convention logo:s/` (SVGs committed under `public/brand/`).

---

## NPM scripts

| Script | Purpose |
|--------|---------|
| `npm run photos:manifest` | Regenerate `src/data/photoManifest.generated.ts` |
| `npm run dev` | Dev server (`predev` runs manifest) |
| `npm run build` | Type-check + production `dist/` |
| `npm run preview` | Serve `dist/` locally |

---

## Routing

| URL | Page |
|-----|------|
| `/` | Home — hero + celebrations grid |
| `/products/:optionId` | Gallery + lightbox (e.g. `haldi-traditional`) |
| `*` | Redirect to `/` |

Option IDs are defined in `src/data/sections.ts`.

---

## Photography

- Images live under `photos/<folder>/`.
- `scripts/generate-photo-manifest.mjs` maps folders → option IDs.
- Ensure `public/photos` symlinks to `../photos`.
- Missing folders use Picsum placeholders via `src/data/mediaUrls.ts`.

---

## Pricing (INR)

Listed prices are defined in `src/data/galleryRates.ts` and shown on gallery tiles where available.

## Costing scope (all pages)

The **Costing includes** block (`src/data/costingIncludes.ts`) appears on the home page and every product gallery — welcome board, entrance arch, backdrop, ambience elements, and table decor.

---

## Security & GitHub

Read **[SECURITY.md](./SECURITY.md)** before pushing.

| Topic | This repo |
|-------|-----------|
| Secrets in git | **Blocked** — `.env`, keys, credentials patterns in `.gitignore` |
| Client env | Only `VITE_*` would be exposed; **not used in `src/` today** |
| API / Swagger | **None** — static files only |
| CI | `permissions: contents: read` only; no repository secrets in workflow |

Before push:

```bash
git status                    # no .env staged
make ci                       # same check as GitHub Actions
```

Optional secret scan:

```bash
rg -i "api[_-]?key|secret|password|token|BEGIN PRIVATE" --glob '!node_modules'
```

---

## GitHub Actions

**`.github/workflows/ci.yml`** — on every push and PR: `npm ci` → `npm run build` → upload `dist/` artifact (7 days). No deploy, no secrets.

---

## Deploy (static hosts)

Build once:

```bash
npm run build
```

Publish the **`dist/`** folder.

| Host | Notes |
|------|--------|
| **Vercel** | Uses `vercel.json` (SPA + security headers) |
| **Netlify** | Uses `public/_headers` |
| **GitHub Pages** | Upload `dist/`; configure 404 → `index.html` |

Deep links require SPA fallback (included in `vite.config.ts` dev middleware; host config for production).

---

## Responsive layout

Phones, tablets, and desktop: `viewport-fit=cover`, safe areas, `100dvh`, fluid grids, container-based card typography. See `src/styles/responsive.css`.

---

## Clone checklist

```bash
git clone https://github.com/Evento-Global/zen-convention-.git
cd zen-convention-
nvm use
npm ci
ln -sf ../photos public/photos   # if symlink missing
make
```

---

## License

Proprietary — **Evento Global Design & Management Company**. All rights reserved.
