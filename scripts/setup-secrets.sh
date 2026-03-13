#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Guidesoft: One-Shot GitHub Secrets Setup for Vercel CI/CD
# Run: bash scripts/setup-secrets.sh
# Prereq: gh CLI logged in, VERCEL_TOKEN env var set
# ─────────────────────────────────────────────────────────────

set -e
REPO="happies2012-cpu/guidesoft-all-in-one"
BRANCH="master"

echo "🔧 Setting up GitHub Secrets for $REPO..."

# ── Supabase keys (hardcoded - rotate if needed) ─────────────
VITE_SUPABASE_URL="https://gvhlkwfbugftdkrcxkeo.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2aGxrd2ZidWdmdGRrcmN4a2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTUwNzMsImV4cCI6MjA1NjI3MTA3M30.2b4VKPDB5mFLMrljMHi3q4s97vGSJeU7C0rrHaJyIa8"

# ── Get Vercel token ──────────────────────────────────────────
if [ -z "$VERCEL_TOKEN" ]; then
  echo "⚠️  VERCEL_TOKEN not set. Get it from: https://vercel.com/account/tokens"
  echo "    Then run: VERCEL_TOKEN=<your_token> bash scripts/setup-secrets.sh"
  exit 1
fi

# ── Get Vercel project/org IDs ────────────────────────────────
echo "📡 Fetching Vercel project info..."
VERCEL_PROJECTS=$(curl -s "https://api.vercel.com/v9/projects" \
  -H "Authorization: Bearer $VERCEL_TOKEN")

VERCEL_PROJECT_ID=$(echo "$VERCEL_PROJECTS" | python3 -c "
import sys, json
data = json.load(sys.stdin)
projects = data.get('projects', [])
for p in projects:
    if 'guidesoft' in p.get('name', '').lower():
        print(p['id'])
        break
" 2>/dev/null)

VERCEL_ORG_ID=$(curl -s "https://api.vercel.com/v2/teams" \
  -H "Authorization: Bearer $VERCEL_TOKEN" | python3 -c "
import sys, json
data = json.load(sys.stdin)
teams = data.get('teams', [])
if teams:
    print(teams[0]['id'])
" 2>/dev/null)

if [ -z "$VERCEL_PROJECT_ID" ]; then
  VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID_OVERRIDE:-}"
  echo "⚠️  Could not auto-detect VERCEL_PROJECT_ID. Set VERCEL_PROJECT_ID_OVERRIDE if needed."
fi

echo "  VERCEL_PROJECT_ID: ${VERCEL_PROJECT_ID:-NOT FOUND}"
echo "  VERCEL_ORG_ID: ${VERCEL_ORG_ID:-NOT FOUND}"

# ── Set GitHub Secrets ────────────────────────────────────────
set_secret() {
  local name=$1
  local value=$2
  if [ -n "$value" ]; then
    echo "$value" | gh secret set "$name" --repo "$REPO"
    echo "  ✅ Set: $name"
  else
    echo "  ⚠️  Skipped (empty): $name"
  fi
}

set_secret "VERCEL_TOKEN"       "$VERCEL_TOKEN"
set_secret "VERCEL_ORG_ID"      "$VERCEL_ORG_ID"
set_secret "VERCEL_PROJECT_ID"  "$VERCEL_PROJECT_ID"
set_secret "VITE_SUPABASE_URL"  "$VITE_SUPABASE_URL"
set_secret "VITE_SUPABASE_ANON_KEY" "$VITE_SUPABASE_ANON_KEY"

echo ""
echo "🎉 Done! GitHub Secrets configured."
echo "   Push to master to trigger auto-deployment."
echo "   GitHub Actions: https://github.com/$REPO/actions"
