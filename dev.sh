
#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Check required package files
if [[ ! -f package.json ]]; then
  echo "Error: Root package.json not found."
  exit 1
fi

if [[ ! -f backend/package.json ]]; then
  echo "Error: backend/package.json not found."
  exit 1
fi

# Install concurrently if it is not already installed
if ! npm ls concurrently --depth=0 >/dev/null 2>&1; then
  npm install --save-dev concurrently
fi

# Ensure dependencies are installed
npm install
npm --prefix backend install

# Start frontend and backend together
npm exec concurrently -- \
  --names "FRONTEND,BACKEND" \
  --prefix-colors "cyan,green" \
  "npm run dev" \
  "npm --prefix backend run dev"
