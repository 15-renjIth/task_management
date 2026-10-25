```bash
#!/usr/bin/env bash
set -Eeuo pipefail

# Project root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "========================================"
echo " Task Management - Development"
echo "========================================"

# Check required package files
if [[ ! -f "$ROOT_DIR/package.json" ]]; then
    echo "Error: Frontend package.json not found."
    exit 1
fi

if [[ ! -f "$ROOT_DIR/backend/package.json" ]]; then
    echo "Error: Backend package.json not found."
    exit 1
fi

# Check Node.js and npm
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is not installed."
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "Error: npm is not installed."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
npm install

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
npm --prefix "$ROOT_DIR/backend" install

# Verify frontend development script
if ! npm run | grep -qE '^[[:space:]]+dev([[:space:]]|$)'; then
    echo "Error: Frontend package.json is missing the 'dev' script."
    exit 1
fi

# Verify backend development script
if ! npm --prefix "$ROOT_DIR/backend" run | grep -qE '^[[:space:]]+dev([[:space:]]|$)'; then
    echo "Error: Backend package.json is missing the 'dev' script."
    echo "Add this to backend/package.json:"
    echo '"dev": "node --watch src/server.js"'
    exit 1
fi

# Start frontend and backend concurrently
echo ""
echo "Starting frontend and backend..."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo "Press Ctrl+C to stop both servers."
echo ""

npm exec --yes --package=concurrently -- concurrently \
    --kill-others \
    --names "FRONTEND,BACKEND" \
    --prefix-colors "cyan,green" \
    "npm run dev" \
    "npm --prefix \"$ROOT_DIR/backend\" run dev"
```