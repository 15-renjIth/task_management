# Task Management

React + Vite frontend with a Node.js + Express backend.

## Quick start

```bash
git clone https://github.com/15-renjIth/task_management.git
cd task_management
```

Install Node.js and npm first. On Ubuntu, NVM is recommended:

```bash
sudo apt update
sudo apt install -y curl git build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm alias default 'lts/*'
nvm use default
node -v
npm -v
```

## Shell scripts

Run these commands from the repository root.

| Script | Purpose | Command |
|---|---|---|
| `script.sh` | Installs dependencies for the root app and configured subprojects. | `./script.sh` |
| `dev.sh` | Starts frontend and backend together for development. | `./dev.sh` |
| `build.sh` | Installs dependencies and builds configured apps. | `./build.sh` |

Make scripts executable after cloning:

```bash
chmod +x script.sh dev.sh build.sh
```

If a script is not present in the repository, skip it or add it before running the command.

### Install dependencies — `script.sh`

```bash
./script.sh
```

The helper should install dependencies from the root `package.json` and, if configured, `backend/package.json`. It prefers `npm ci` when a lock file is present and falls back to `npm install` if the lock file is out of sync.

Manual alternative:

```bash
npm install
npm --prefix backend install
```

### Run development — `dev.sh`

```bash
./dev.sh
```

Expected setup:
- Root `package.json` defines a `dev` script, usually `vite`.
- `backend/package.json` defines a `dev` script, usually `nodemon src/server.js`.
- The `backend/` directory exists.

Typical local URLs (use the addresses printed in the terminal):
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

Stop both services with `Ctrl+C`.

Run separately if needed:

```bash
npm run dev
npm --prefix backend run dev
```

### Build — `build.sh`

```bash
./build.sh
```

The helper installs dependencies and runs the root `build` script if present. It also runs a backend build only if `backend/package.json` defines one.

Manual frontend build and preview:

```bash
npm run build
npm run preview
```

Vite output is usually generated in `dist/`. Plain JavaScript Express apps generally do not need a separate build step; TypeScript backends usually do.

## Expected project structure

Adjust this to match the actual repository:

```text
task_management/
├── src/                    # React frontend
├── public/                 # Public assets, if present
├── backend/
│   ├── src/server.js       # Example Express entry point
│   ├── package.json
│   └── package-lock.json
├── package.json
├── package-lock.json
├── script.sh
├── dev.sh
├── build.sh
├── .env.example            # Optional template
└── README.md
```

## Environment variables

Create local `.env` files only when required by your code. Example backend setting:

```dotenv
PORT=5000
```

For Supabase, use the variable names expected by your application. Never commit real `.env` files, passwords, API keys, or Supabase service-role keys. Vite variables prefixed with `VITE_` are exposed in browser code and must not contain secrets.

## Git workflow

Commit `package.json` and `package-lock.json` together for each Node.js app (root and backend). Do not commit `node_modules/`, generated `dist/` output unless your deployment workflow requires it, or local secrets.

```bash
git status
git add README.md script.sh dev.sh build.sh package.json package-lock.json
# If backend files exist:
git add backend/package.json backend/package-lock.json
git commit -m "Document setup scripts and workflow"
git push
```

Only stage files that exist and that you intend to commit.

## Troubleshooting

### `npm ci` reports that the lock file is out of sync

```bash
npm install
git status
```

Review and commit the updated lock file with its matching `package.json`.

### `Missing script: dev` or `Missing script: build`

Check the relevant `package.json`. The frontend and backend have separate script sections when they are separate apps.

### Port 5173 or 5000 is already in use

```bash
sudo lsof -i :5173
sudo lsof -i :5000
```

Confirm which process owns the port before stopping it, or configure a different port.

### `dev.sh` says `backend/package.json` is missing

The helper expects `backend/`. Create/configure that directory or update the script to match the actual backend path.

## Notes

- These scripts are local development/build helpers, not production deployment automation.
- Database persistence, authentication, and email invitations work only if implemented and configured in the app.
- Review shell scripts before running them, especially scripts obtained from external sources.
