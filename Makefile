# =============================================================================
# Evento Global — zen convention frontend
#
# Recommended one-shot localhost: `make`  (kills stale dev ports, then Vite)
# Quick rerun without touching ports:     `make dev`
# =============================================================================

DEV_PORTS ?= 3000 4173 5173 5174 5175 8080 8888 24678
LIVE_URL ?= https://zen-convention.vercel.app

.PHONY: default help install dev local start run build preview ci clean kill-ports check-ports security-check live-security-check nuke

## default — free typical Vite/dev ports, then start dev server → http://localhost:5173
default: local

help:
	@echo ""
	@echo "  Evento Global — Makefile"
	@echo "  -----------------------"
	@grep -E '^##' Makefile | sed -E 's/^## /  /'
	@echo ""

## install — npm install (after clone / lockfile change)
install:
	npm install

## dev — Vite dev only (does not kill processes on ports)
dev:
	npm run dev

## local — SIGKILL listeners on DEV_PORTS (see top of Makefile), then Vite dev
local: kill-ports
	npm run dev

## start — alias for local
start: local

## run — alias for local (one-shot dev)
run: local

## build — type-check + emit dist/ for production
build:
	npm run build

## preview — serve dist/ locally
preview:
	npm run preview

## ci — reproducible CI install + build (what GitHub Actions runs)
ci:
	npm ci
	npm run build

## clean — remove build artefacts and Vite caches
clean:
	rm -rf dist build out .vite node_modules/.vite
	find . -name '.DS_Store' -not -path './node_modules/*' -delete 2>/dev/null || true

## kill-ports — aggressively free DEV_PORTS ($(DEV_PORTS))
kill-ports:
	@for p in $(DEV_PORTS); do \
		pids="$$(lsof -ti tcp:$$p 2>/dev/null)"; \
		if [ -n "$$pids" ]; then \
			echo "kill port $$p (pids: $$pids)"; \
			echo $$pids | xargs kill -9 2>/dev/null || true; \
		else \
			echo "port $$p — free"; \
		fi; \
	done

## security-check — scan tracked tree for common secret patterns (no .env)
security-check:
	@echo "==> Secret pattern scan (excluding node_modules)"
	@if command -v rg >/dev/null 2>&1; then \
		! rg -i "api[_-]?key|secret|password|token|BEGIN PRIVATE|sk_live|sk_test" \
			--glob '!.env*' --glob '!node_modules' --glob '!package-lock.json' --glob '!*.md' . \
			|| (echo "FAIL: possible secret in repo — review above"; exit 1); \
	else \
		! grep -rniE "api[_-]?key|secret|password|token|BEGIN PRIVATE|sk_live|sk_test" \
			--exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist \
			--exclude='package-lock.json' --exclude='*.md' --exclude='.env.example' \
			src scripts public index.html vite.config.ts 2>/dev/null \
			|| (echo "FAIL: possible secret in repo — review above"; exit 1); \
	fi
	@test ! -f .env || (echo "FAIL: .env exists — must not be committed"; exit 1)
	@test -z "$$(git ls-files '.env' 2>/dev/null | grep -v '^\.env\.example$$')" || (echo "FAIL: .env tracked by git"; exit 1)
	@test -z "$$(git ls-files | grep -iE '\.(pem|key|p12)$$|credentials\.json|service-account')" || (echo "FAIL: credential file tracked"; exit 1)
	@echo "OK: no obvious secret patterns; .env not present"

## live-security-check — probe deployed static site (override LIVE_URL=...)
live-security-check:
	@echo "==> Probing $(LIVE_URL)"
	@for path in / /api /api/v1 /swagger /swagger-ui /openapi.json /.env /graphql /admin; do \
		code=$$(curl -sS -o /tmp/zen-live-probe.txt -w '%{http_code}' "$(LIVE_URL)$$path" 2>/dev/null || echo 000); \
		echo "$$path -> HTTP $$code"; \
	done
	@echo "==> Body scan (must not contain secrets)"
	@curl -sS "$(LIVE_URL)/" -o /tmp/zen-live-home.html 2>/dev/null || (echo "FAIL: cannot reach $(LIVE_URL)"; exit 1)
	@! grep -qiE 'api[_-]?key|BEGIN PRIVATE|sk_live|sk_test|VITE_[A-Z_]+=' /tmp/zen-live-home.html 2>/dev/null \
		|| (echo "FAIL: suspicious content on home page"; exit 1)
	@echo "OK: live probe complete for $(LIVE_URL)"

## check-ports — show listeners on DEV_PORTS
check-ports:
	@for p in $(DEV_PORTS); do \
		pids="$$(lsof -ti tcp:$$p 2>/dev/null)"; \
		if [ -n "$$pids" ]; then \
			echo "port $$p — BUSY (pids: $$pids)"; \
		else \
			echo "port $$p — free"; \
		fi; \
	done

## nuke — clean + delete node_modules (full reset; run make install after)
nuke: clean
	rm -rf node_modules
