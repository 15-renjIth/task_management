#!/usr/bin/env bash
set -Eeuo pipefail

# Organizo project build helper.
# Run this script from the repository root, or invoke it by its path.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

log() {
  printf '\n\033[1;34m[build]\033[0m %s\n' "$1"
}

fail() {
  printf '\n\033[1;31m[error]\033[0m %s\n' "$1" >&2
  exit 1
}

command -v node >/dev/null 2>&1 || fail "Node.js is not installed. Install Node.js first."
command -v npm >/dev/null 2>&1 || fail "npm is not installed. Install Node.js/npm first."

log "Using Node.js $(node --version) and npm $(npm --version)"
log "Project root: $ROOT_DIR"

install_deps() {
  local dir="$1"
  if [[ ! -f "$dir/package.json" ]]; then
    return 0
  fi

  log "Installing dependencies in $dir"
  (
    cd "$dir"
    if [[ -f package-lock.json ]]; then
      # Prefer reproducible installs. If the lock file is stale, repair it with npm install.
      if ! npm ci; then
        printf '[build] npm ci failed in %s; retrying with npm install to sync the lock file.\n' "$dir"
        npm install
      fi
    else
      npm install
    fi
  )
}

# Install root/frontend dependencies.
install_deps "$ROOT_DIR"

# Install backend dependencies if this repository has a backend directory.
if [[ -d "$ROOT_DIR/backend" ]]; then
  install_deps "$ROOT_DIR/backend"
fi

# Build the root app if it defines a build script (e.g. Vite React frontend).
if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.build ? 0 : 1)" 2>/dev/null; then
  log "Building root application"
  npm run build
else
  printf '[build] No root "build" script found; skipping root build.\n'
fi

# Build backend only if it defines a build script (e.g. a TypeScript backend).
if [[ -f "$ROOT_DIR/backend/package.json" ]] && \
   node -e "const p=require('./backend/package.json'); process.exit(p.scripts && p.scripts.build ? 0 : 1)" 2>/dev/null; then
  log "Building backend"
  (cd "$ROOT_DIR/backend" && npm run build)
else
  printf '[build] No backend build script found; skipping backend build (typical for plain JavaScript).\n'
fi

log "Build process completed successfully."
