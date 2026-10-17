#!/usr/bin/env bash
# ==============================================================================
# Automated One-Shot VPS Deployment Script for Ariya Sarrafzadeh Portfolio
# Usage:
#   ./deploy/deploy-vps.sh user@vps-ip [remote-path]
# Example:
#   ./deploy/deploy-vps.sh root@185.x.x.x /var/www/portfolio
# ==============================================================================

set -euo pipefail

TARGET_HOST="${1:-}"
REMOTE_PATH="${2:-/var/www/portfolio}"

if [ -z "$TARGET_HOST" ]; then
    echo "Error: VPS host not specified."
    echo "Usage: ./deploy/deploy-vps.sh user@vps-ip [/var/www/portfolio]"
    exit 1
fi

echo "==> Step 1: Building production static distribution..."
npm run build

echo "==> Step 2: Preparing remote directory on ${TARGET_HOST}..."
ssh "$TARGET_HOST" "mkdir -p ${REMOTE_PATH}"

echo "==> Step 3: Syncing distribution assets via rsync..."
rsync -avz --delete \
    --exclude '.git' \
    --exclude 'node_modules' \
    dist/ "${TARGET_HOST}:${REMOTE_PATH}/"

echo "==> Step 4: Ensuring proper web permissions..."
ssh "$TARGET_HOST" "chmod -R 755 ${REMOTE_PATH}"

echo "==> Deployment complete! Verification check:"
ssh "$TARGET_HOST" "ls -la ${REMOTE_PATH} | head -n 10"

echo "==> SUCCESS: Live on ${TARGET_HOST}:${REMOTE_PATH}"
