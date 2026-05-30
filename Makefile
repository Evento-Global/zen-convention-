# =============================================================================
# Evento Global — zen convention frontend
#
# Recommended one-shot localhost: `make`  (kills stale dev ports, then Vite)
# Quick rerun without touching ports:     `make dev`
# =============================================================================

DEV_PORTS ?= 3000 4173 5173 5174 5175 8080

.PHONY: default help install dev local start build preview ci clean kill-ports check-ports nuke

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
