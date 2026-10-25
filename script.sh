#!/usr/bin/env bash
set -Eeuo pipefail

# Install npm dependencies after cloning the Organizo/task-management repository.
# Run from the repository root: bash install-dependencies.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Error: Node.js and npm are required but were not found."
  echo "Install Node.js LTS (NVM is recommended), then reopen your terminal and retry."
  exit 1
fi

NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if (( NODE_MAJOR < 20 )); then
  echo "Warning: You are using Node.js $(node -v). Current Vite projects may require Node.js 20.19+ or 22.12+."
  echo "Consider switching to a supported LTS version with NVM before continuing."
fi

echo "Node.js: $(node -v)"
echo "npm:     $(npm -v)"
echo "Project: $ROOT_DIR"

install_in_dir() {
    local dir="$1"
    local label="$2"

    if [[ ! -f "$dir/package.json" ]]; then
        echo "Skipping $label: package.json not found."
        return 0
    fi

    echo ""
    echo "Installing $label dependencies..."

    (
        cd "$dir"

        if [[ -f package-lock.json ]]; then
            if ! npm ci; then
                echo "npm ci failed. Retrying with npm install..."
                npm install
            fi
        else
            npm install
        fi
    )
}

# Install root project dependencies when the repository itself is an npm project.
install_in_dir "$ROOT_DIR" "root project"

# Also support common split frontend/backend layouts. Missing directories are skipped.
for subdir in frontend backend client server; do
  if [[ -d "$ROOT_DIR/$subdir" && "$ROOT_DIR/$subdir" != "$ROOT_DIR" ]]; then
    install_in_dir "$ROOT_DIR/$subdir" "$subdir"
  fi
done

cd "$ROOT_DIR"
echo
 echo "Dependency installation finished."
echo "Start the app using the scripts defined in the relevant package.json files."
