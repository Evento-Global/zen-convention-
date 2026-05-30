# =============================================================================
# Production image: Vite build → nginx (Cloud Run injects PORT via envsubst template)
# =============================================================================
FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ------------------------------------------------------------------------------
FROM nginx:1.26-alpine

ENV PORT=8080

COPY deploy/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
