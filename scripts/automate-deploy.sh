#!/bin/bash

# Configuration
REPO="happies2012-cpu/guidesoft-all-in-one"

echo "🚀 GUIDESOFT Environment Sync & Automation"
echo "------------------------------------------"

# Sync Supabase keys from .env
if [ -f .env ]; then
    echo "📦 Syncing .env to GitHub Secrets..."
    while IFS= read -r line || [ -n "$line" ]; do
        if [[ $line =~ ^VITE_ ]]; then
            key=$(echo $line | cut -d'=' -f1)
            value=$(echo $line | cut -d'=' -f2- | tr -d '"')
            gh secret set "$key" --body "$value" --repo "$REPO"
            echo "✅ Set $key"
        fi
    done < .env
else
    echo "❌ .env file not found!"
fi

echo ""
echo "📝 One-time Automation Requirement:"
echo "To make production deployment 'human-free', please run:"
echo "  1. vercel token add (to get a token)"
echo "  2. gh secret set VERCEL_TOKEN --body 'your_token' --repo $REPO"
echo "  3. gh secret set VERCEL_ORG_ID --body 'your_org_id' --repo $REPO"
echo "  4. gh secret set VERCEL_PROJECT_ID --body 'your_project_id' --repo $REPO"
echo ""
echo "Once set, every push to 'master' will automatically deploy to Vercel with all production ENV variables."
