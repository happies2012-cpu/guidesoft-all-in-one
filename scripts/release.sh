#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Installing dependencies"
npm install

echo "==> Ensuring Playwright Chromium is installed"
npx playwright install chromium

echo "==> Running production verification"
npm run check

echo "==> Running Playwright smoke tests"
npm run test:e2e

echo "==> Checking GitHub authentication"
gh auth status

echo "==> Pushing latest commit"
git push origin HEAD

echo "==> Checking Vercel authentication"
vercel whoami

echo "==> Deploying to Vercel production"
vercel deploy --prod --yes
