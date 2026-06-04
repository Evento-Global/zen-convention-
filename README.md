# Evento Global — Celebrations (Zen Convention)

Static **Vite + React + TypeScript** site for Evento Global × Zen Convention: hero, celebration flip-cards, product galleries, INR pricing, lightbox, and costing scope.

**No backend** — no API routes, no Swagger/OpenAPI, no database, no server-side secrets, no GCP deploy in this repo.

**Live:** [zen-convention.vercel.app](https://zen-convention.vercel.app)

---

## Quick start (one command)

```bash
make
```

1. Frees common dev ports (`DEV_PORTS` in the `Makefile`)
2. Regenerates the photo manifest (`predev`)
3. Starts Vite at **http://localhost:5173**

| Target | Purpose |
|--------|---------|
| `make` / `make local` | Kill stale ports → dev server |
| `make dev` | Dev only (no port kill) |
| `make build` | Type-check + `dist/` |
| `make ci` | `npm ci` + build (same as GitHub Actions) |
| `make security-check` | Scan repo for secret patterns |
| `make live-security-check` | Probe live URL (no API/Swagger/env leaks) |
| `make kill-ports` / `make check-ports` | Free or inspect dev ports |
| `make help` | List all targets |

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
├── .github/workflows/ci.yml   # push/PR: npm ci + build (read-only, no secrets)
├── public/
│   ├── brand/                 # Evento + Zen logos
│   ├── _headers               # Netlify security headers
│   └── photos → ../photos     # symlink (required for /photos/… URLs)
├── photos/                    # event imagery (scanned at build/dev)
├── scripts/
│   ├── generate-photo-manifest.mjs
│   └── dedupe-photos.mjs      # optional maintenance
├── src/
│   ├── components/            # Hero, SectionCard, Lightbox, BrandLockup, CostingIncludes
│   ├── data/                  # sections, rates, exclusions, manifest, costing
│   ├── pages/                 # HomePage, ProductGalleryPage
│   ├── hooks/
│   ├── styles/responsive.css
│   └── utils/pricing.ts
├── .env.example               # template only — never commit `.env`
├── SECURITY.md
├── Makefile
├── vercel.json                # SPA + security headers (Vercel)
├── index.html
├── package.json
└── vite.config.ts
```

**Gitignored (local only):** `.env`, `dist/`, price screenshot folders (`Zen convention rate /`, `more prices/`, `even more prices/`, `even even more prices/`), `zen convention logo:s/`, `.gcp/`, `.vercel/`.

---

## Celebration styles

Each section uses **Traditional** and/or **Contemporary** only (no “semi traditional” on the site).

| Section | Options |
|---------|---------|
| Haldi | Traditional, Contemporary |
| Pellikuturu | Traditional |
| Mehendi | Traditional, Contemporary |
| Sangeet | With LED, With structure |
| Wedding | Traditional, Contemporary |
| Reception | Contemporary |
| Cradle / Birthday | Contemporary |

Gallery slugs: `haldi-traditional`, `haldi-contemporary`, `mehendi-contemporary`, etc. Old URLs redirect automatically (see `LEGACY_OPTION_IDS` in `src/data/sections.ts`).

---

## Routing

| URL | Page |
|-----|------|
| `/` | Home — hero + celebrations |
| `/products/:optionId` | Gallery + lightbox |
| `*` | Redirect to `/` |

---

## Photography

- Images under `photos/<folder>/` mapped in `scripts/generate-photo-manifest.mjs`.
- Run `npm run photos:manifest` or rely on `predev` / `prebuild`.
- Ensure `public/photos` → `../photos` symlink exists after clone.

---

## Pricing & gallery curation

- Base INR in `src/data/galleryRates.ts`; listed price = base + ₹30,000 (`src/utils/pricing.ts`).
- Designs marked **X** on internal rate sheets are hidden via `src/data/galleryExclusions.ts` (REF numbers stay stable).
- Transcribe new rates from gitignored screenshot folders into `galleryRates.ts` / `galleryExclusions.ts`.

---

## Security & GitHub

Read **[SECURITY.md](./SECURITY.md)** before pushing.

| Topic | Status |
|-------|--------|
| Secrets in git | Blocked — `.env*`, keys, GCP/AWS dirs in `.gitignore` |
| Runtime env | **Not used** in `src/` (no `import.meta.env`) |
| API / Swagger | **None** — static SPA only |
| CI secrets | **None** — `permissions: contents: read` |

Before push:

```bash
git status                    # no .env or price folders staged
make ci
make security-check
```

After deploy:

```bash
make live-security-check
```

---

## Deploy

```bash
npm run build
```

Publish **`dist/`** to Vercel, Netlify, or GitHub Pages. This repo includes `vercel.json` and `public/_headers` for security headers and SPA routing.

---

## Clone checklist

```bash
git clone https://github.com/Evento-Global/zen-convention-.git
cd zen-convention-
nvm use
npm ci
ln -sf ../photos public/photos
make
```

---

## License

Proprietary — **Evento Global Design & Management Company**. All rights reserved.
