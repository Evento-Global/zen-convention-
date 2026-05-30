#!/usr/bin/env bash
# Deploy static site to Cloud Run (Docker). Requires: gcloud logged in, billing enabled.
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-personal-491317}"
REGION="${GCP_REGION:-asia-south1}"
SERVICE="${GCP_SERVICE_NAME:-evento-vineeta-zen}"
REPOSITORY="${ARTIFACT_REGISTRY_REPO:-evento-docker}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE}:${IMAGE_TAG}"

echo "==> Project: ${PROJECT_ID}  Region: ${REGION}  Service: ${SERVICE}"
gcloud config set project "${PROJECT_ID}"

echo "==> Enabling APIs (idempotent)"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --quiet

if ! gcloud artifacts repositories describe "${REPOSITORY}" --location="${REGION}" >/dev/null 2>&1; then
  echo "==> Creating Artifact Registry repo: ${REPOSITORY}"
  gcloud artifacts repositories create "${REPOSITORY}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="Docker images for Evento site"
fi

echo "==> Cloud Build: ${IMAGE}"
gcloud builds submit --tag "${IMAGE}" --project "${PROJECT_ID}" --timeout=1200s .

echo "==> Cloud Run deploy"
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --project "${PROJECT_ID}" \
  --quiet

URL="$(gcloud run services describe "${SERVICE}" --region="${REGION}" --project="${PROJECT_ID}" --format='value(status.url)')"

echo ""
echo "==> Service URL: ${URL}"

echo "==> GET /health"
curl -fsS "${URL}/health" && echo ""
echo "Health check OK."
