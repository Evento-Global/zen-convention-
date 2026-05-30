# Evento Global — Celebrations website

Static **Vite + React + TypeScript** site: hero, seven celebration flip-cards (Haldi through Cradle / Birthday), and a **product-style gallery + lightbox** per styling direction (`/products/:optionId`).

No backend in this repo. Suitable for **Cloud Run (Docker)**, GitHub Pages, Vercel, Netlify, or GCS static hosting.

---

## Responsive layout (phones, tablets, desktop)

- **`viewport-fit=cover`** + **`theme-color`** in **`index.html`** for notched phones and browser chrome.
- **`100dvh`** with **`100vh`** fallback on hero and shell so mobile browser toolbars don’t clip content.
- **`env(safe-area-inset-*)`** on hero, moments grid, PDP header/footer, and lightbox so content clears iOS safe areas.
- **`overflow-x: clip`** on **`html`**, **`body`**, and **`#root`** to avoid horizontal scroll from wide content.
- Gallery grids use **`minmax(0, 1fr)`** and caption wrapping (see **`ProductGalleryPage.css`**) so many images don’t blow out the viewport width.

---

## Requirements

| Item        | Detail                          |
| ----------- | ------------------------------- |
| Node.js     | **20.x** (`nvm use` via `.nvmrc`) |
| Package mgr | npm (lockfile: `package-lock.json`) |

---

## One-shot localhost (`make`)

From the repo root:

```bash
make
```

That is the **`default`** target:

1. **`kill-ports`** — sends **SIGKILL** to anything listening on the dev ports listed in the `Makefile` (`DEV_PORTS`, default `3000 4173 5173–5175 8080`).
2. **`npm run dev`** — Vite at **http://localhost:5173**

To start Vite **without** touching ports:

```bash
make dev
```

See all targets:

```bash
make help
```

---

## NPM scripts

| Script              | Purpose |
| ------------------- | ------- |
| `npm run photos:manifest` | Regenerate `src/data/photoManifest.generated.ts` from `photos/` |
| `npm run dev`       | Dev server (also runs **`predev`** → manifest) |
| `npm run build`     | **`prebuild`** (manifest) → `tsc --noEmit` → `vite build` → `dist/` |
| `npm run preview`   | Serve **`dist/`** locally |

Prefer **`make`** for **install / local / ci / clean / kill-ports**.

---

## Project layout

```
.
├── deploy/
│   ├── default.conf.template    # nginx: SPA + gzip + /health (${PORT} from Cloud Run)
│   └── gcp-cloud-run.sh           # Cloud Build image + Cloud Run deploy + health check
├── Dockerfile                   # multi-stage: npm run build → nginx:alpine
├── .dockerignore
├── .gcloudignore                # shrinks Cloud Build source upload
├── .github/workflows/ci.yml     # CI on push & PR — npm ci + build
├── public/
│   ├── logo.jpeg
│   └── photos -> ../photos      # symlink; served as /photos/…
├── photos/                      # Event imagery; scanned by generate-photo-manifest
├── scripts/
│   └── generate-photo-manifest.mjs
├── src/
│   ├── components/              # Hero, SectionCard, Lightbox
│   ├── data/
│   │   ├── sections.ts
│   │   ├── photoManifest.generated.ts   # generated (also refreshed on prebuild/predev)
│   │   └── mediaUrls.ts
│   ├── pages/                   # HomePage, ProductGalleryPage
│   ├── App.tsx, App.css, main.tsx, index.css
│   └── vite-env.d.ts
├── .env.example                 # placeholders only — no secrets (see Security)
├── .gitignore                   # excludes .env*, build output, credential patterns
├── .nvmrc
├── Makefile
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Convention: **`components/`** stays presentational; route shells live under **`pages/`**; copy and lookups live in **`src/data/`**.

---

## Routing

| URL                    | Purpose                 |
| ---------------------- | ----------------------- |
| `/`                    | Home (hero + celebrations grid) |
| `/products/:optionId`  | Gallery for one look (`EventStyleOption.id`) |
| `*`                    | Redirect to `/`         |

Gallery keys are defined in **`src/data/sections.ts`** (e.g. `haldi-traditional`, `reception-contemporary`).

---

## Photography manifest

Real images live under **`photos/<folder>/`**. **`scripts/generate-photo-manifest.mjs`** maps folder names → option IDs and emits **`photoManifest.generated.ts`**.

- **`npm run dev`** / **`npm run build`** run **`photos:manifest`** automatically (`predev` / `prebuild`).
- **`public/photos`** must symlink to **`../photos`** so Vite serves **`/photos/...`**.

Looks without folders fall back to Picsum placeholders via **`resolveImageSrc()`** in **`src/data/mediaUrls.ts`**.

---

## Security & secrets (GitHub / Vercel / GCP)

Follow these rules so **nothing sensitive is pushed** or compiled into **public JS**:

| Rule | Detail |
| ---- | ------ |
| **Never commit** | `.env`, `.env.*`, private keys, GCP service-account JSON, `credentials.json`, `application_default_credentials.json` — all covered in **`.gitignore`**. |
| **Client exposure** | Vite only exposes **`VITE_*`** to the browser. Treat every **`VITE_*`** value as **public** (searchable in `dist/`). Do not put API keys or tokens in **`VITE_*`**. |
| **This repo today** | No **`import.meta.env`** usage in `src/`; **`.env.example`** uses empty optional placeholders only. |
| **Vercel / Netlify** | Add future env vars in the host **dashboard**, not in the repo. |
| **GCP** | Use **Secret Manager** / workload identity for deploy-time secrets; never bake keys into the static bundle. |
| **CI** | Workflow uses **`permissions: contents: read`** only and does not pass repository secrets into the build. |

If you add analytics or API keys later, keep **server-only** keys out of the repo and out of **`VITE_*`**.

---

## GitHub Actions CI

**File:** `.github/workflows/ci.yml`

**Triggers:** every **`push`**, every **`pull_request`**, and **`workflow_dispatch`**.

**Steps:** checkout → Node from **`.nvmrc`** → **`npm ci`** → **`npm run build`** (includes type-check and photo manifest) → upload **`dist/`** as a **7-day artifact** (no deploy in this workflow).

---

## Deploy — Google Cloud Run (Docker)

Prerequisites: [gcloud CLI](https://cloud.google.com/sdk/docs/install) authenticated (`gcloud auth login`), project **`personal-491317`**, billing enabled.

```bash
./deploy/gcp-cloud-run.sh
```

Defaults (override with env vars if needed):

| Variable | Default |
| -------- | ------- |
| `GCP_PROJECT_ID` | `personal-491317` |
| `GCP_REGION` | `asia-south1` |
| `GCP_SERVICE_NAME` | `evento-vineeta-zen` |
| `ARTIFACT_REGISTRY_REPO` | `evento-docker` |

The script enables **Cloud Run**, **Artifact Registry**, and **Cloud Build**; builds the **`Dockerfile`** in the cloud; pushes to **`asia-south1-docker.pkg.dev/...`**; deploys **`evento-vineeta-zen`** with **`--allow-unauthenticated`** and **`--port 8080`**; then runs **`curl "${URL}/health"`** (expects **`ok`**).

**Health:** **`GET /health`** — plain text **`ok`**, for uptime or probes.

**SPA:** nginx **`try_files`** returns **`index.html`** for unknown paths so React Router deep links work.

> If `gcloud` warns about a missing project **environment** tag, add it in the Google Cloud console (Resource Manager) — deployment still succeeds.

---

## Deploy — other static hosts

- **Build output:** `dist/`
- **SPA:** deep links need **404 → `index.html`**. Vite dev uses a small fallback in **`vite.config.ts`**.
- **Vercel:** framework **Vite**; output **`dist`**.
- **Netlify:** build `npm run build`, publish **`dist`**.
- **GCS / Cloud Storage:** upload **`dist/*`**; configure website + 404 → **`index.html`**.

---

## Browser support

Recent Chromium, Firefox, Safari (last two major versions). Uses `backdrop-filter`, `aspect-ratio`, `100dvh`, safe-area inset env vars, `@media (hover: hover)`, and container-based type on celebration cards.

---

## License

Proprietary — all rights reserved by **Evento Global Design & Management Company**.
