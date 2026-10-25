#!/usr/bin/env bash
set -Eeuo pipefail

# ==========================================
# Organizo Task Management - Project Manager
# ==========================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

INSTALL_SCRIPT="$ROOT_DIR/install-dependencies.sh"
BUILD_SCRIPT="$ROOT_DIR/build.sh"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:5000"

cd "$ROOT_DIR"

log() {
    printf '\n\033[1;34m[manage]\033[0m %s\n' "$1"
}

fail() {
    printf '\n\033[1;31m[error]\033[0m %s\n' "$1" >&2
    exit 1
}

check_requirements() {
    command -v node >/dev/null 2>&1 ||
        fail "Node.js is not installed."

    command -v npm >/dev/null 2>&1 ||
        fail "npm is not installed."

    [[ -f "$ROOT_DIR/package.json" ]] ||
        fail "Root package.json not found."

    [[ -f "$BACKEND_DIR/package.json" ]] ||
        fail "Backend package.json not found."
}

check_script() {
    local dir="$1"
    local script="$2"

    node -e '
      const p = require(process.argv[1]);
      process.exit(p.scripts?.[process.argv[2]] ? 0 : 1);
    ' "$dir/package.json" "$script" ||
        fail "Missing '$script' script in $dir/package.json"
}

run_install() {
    [[ -f "$INSTALL_SCRIPT" ]] ||
        fail "install-dependencies.sh not found."

    log "Installing project dependencies"

    bash "$INSTALL_SCRIPT"
}

run_build() {
    [[ -f "$BUILD_SCRIPT" ]] ||
        fail "build.sh not found."

    log "Building frontend and backend"

    bash "$BUILD_SCRIPT"
}

run_build_frontend() {
    log "Building frontend"

    check_script "$ROOT_DIR" "build"

    npm --prefix "$ROOT_DIR" run build

    log "Frontend build completed"
}

run_build_backend() {
    log "Building backend"

    if node -e '
      const p = require(process.argv[1]);
      process.exit(p.scripts?.build ? 0 : 1);
    ' "$BACKEND_DIR/package.json"; then
        npm --prefix "$BACKEND_DIR" run build
    else
        log "No backend build script; checking JavaScript syntax"

        node --check "$BACKEND_DIR/src/server.js"
        node --check "$BACKEND_DIR/src/routes/tasks.js"
        node --check "$BACKEND_DIR/src/lib/supabase.js"

        log "Backend syntax check completed"
    fi
}

run_dev() {
    check_script "$ROOT_DIR" "dev"
    check_script "$BACKEND_DIR" "dev"

    log "Starting frontend and backend"

    echo "Frontend: $FRONTEND_URL"
    echo "Backend:  $BACKEND_URL"
    echo "Press Ctrl+C to stop both servers."

    npm exec --yes --package=concurrently -- concurrently \
        --kill-others \
        --names "FRONTEND,BACKEND" \
        --prefix-colors "cyan,green" \
        "npm --prefix \"$ROOT_DIR\" run dev" \
        "npm --prefix \"$BACKEND_DIR\" run dev"
}

run_frontend() {
    log "Starting frontend development server"

    check_script "$ROOT_DIR" "dev"

    npm --prefix "$ROOT_DIR" run dev
}

run_backend() {
    log "Starting backend server"

    check_script "$BACKEND_DIR" "start"

    npm --prefix "$BACKEND_DIR" run start
}

run_preview() {
    log "Starting production frontend preview"

    check_script "$ROOT_DIR" "preview"

    npm --prefix "$ROOT_DIR" run preview
}

show_help() {
    cat <<'EOF'
Organizo Task Management - Commands

Usage: ./manage.sh <command>

  install           Install dependencies
  build             Run the existing build.sh script
  build-frontend    Build React frontend only
  build-backend     Build/check backend only
  dev               Start frontend and backend together
  frontend          Start frontend development server only
  backend           Start backend server only
  preview           Preview production frontend build
  help              Show this help

Examples:

  ./manage.sh install
  ./manage.sh dev
  ./manage.sh build
  ./manage.sh build-frontend
  ./manage.sh backend

EOF
}

main() {
    case "${1:-help}" in
        install)
            check_requirements
            run_install
            ;;
        build)
            check_requirements
            run_build
            ;;
        build-frontend)
            check_requirements
            run_build_frontend
            ;;
        build-backend)
            check_requirements
            run_build_backend
            ;;
        dev)
            check_requirements
            run_dev
            ;;
        frontend)
            check_requirements
            run_frontend
            ;;
        backend)
            check_requirements
            run_backend
            ;;
        preview)
            check_requirements
            run_preview
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            show_help
            fail "Unknown command: $1"
            ;;
    esac
}

main "$@"