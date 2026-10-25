# Task Management

A task management application built with **React, Vite, Node.js, Express.js, and Supabase**.

## 1. System Requirements

Ensure the following software is installed before setting up the application.

| Requirement | Purpose |
|---|---|
| Ubuntu/Linux | Development environment |
| Node.js | JavaScript runtime |
| npm | Package and dependency management |
| Git | Repository cloning |
| Supabase | Database and backend services |
| Internet connection | Dependency installation and database connectivity |

**Node.js:** Use a version compatible with your installed Vite version. Recent Vite releases may require Node.js 20.19+ or 22.12+.

## 2. Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/15-renjIth/task_management.git
cd task_management
```

### Step 2: Install Node.js and npm

For Ubuntu, NVM (Node Version Manager) is recommended.

Install the required packages:

```bash
sudo apt update
sudo apt install -y curl git build-essential
```

Install NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
```

Reload the terminal configuration:

```bash
source ~/.bashrc
```

Install Node.js LTS:

```bash
nvm install --lts
nvm alias default 'lts/*'
nvm use default
```

Verify the installation:

```bash
node -v
npm -v
```

### Step 3: Make the shell scripts executable

Run the following command from the project root:

```bash
chmod +x script.sh manage.sh build.sh
```

Ensure all three scripts exist before running this command.

## 3. Shell Scripts

Run all commands from the project root directory.

| Script | Purpose | Command |
|---|---|---|
| `script.sh` | Installs frontend and backend dependencies. | `./script.sh` |
| `manage.sh` | Manages application tasks, including development server startup. | `./manage.sh dev` |
| `build.sh` | Installs dependencies and builds the configured applications. | `./build.sh` |

### Install dependencies

Run:

```bash
./script.sh
```

The installation script should install dependencies from the root `package.json` and `backend/package.json`.

Alternatively, install dependencies manually:

```bash
npm install
npm --prefix backend install
```

### Start development servers

Run:

```bash
./manage.sh dev
```

The command should start the frontend and backend development servers according to the configuration in `manage.sh`.

Typical local development URLs:

| Application | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |

The actual URLs depend on the application configuration.

Press `Ctrl+C` to stop the development processes.

### Available management commands

The following commands are examples of possible `manage.sh` operations. Use only the commands implemented in your actual script.

| Command | Purpose |
|---|---|
| `./manage.sh dev` | Start frontend and backend development servers |
| `./manage.sh install` | Install dependencies |
| `./manage.sh build` | Build configured applications |
| `./manage.sh build-frontend` | Build the frontend |
| `./manage.sh build-backend` | Build or validate the backend |
| `./manage.sh frontend` | Start the frontend separately |
| `./manage.sh backend` | Start the backend separately |
| `./manage.sh preview` | Preview the frontend production build |
| `./manage.sh help` | Display available commands |

### Build the application

Run:

```bash
./build.sh
```

The build script should install dependencies and execute the configured build commands.

To build the frontend manually:

```bash
npm run build
```

To preview the production frontend:

```bash
npm run preview
```

Vite normally generates the production files in the `dist/` directory.

A plain JavaScript Express backend generally does not require compilation. A TypeScript backend typically needs a separate build step.

## 4. Expected Project Structure

```text
task_management/
├── src/                        # React frontend
│   ├── api/
│   │   └── tasks.js
│   ├── App.jsx
│   └── main.jsx
├── public/                     # Static assets, if present
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.js
│   │   ├── routes/
│   │   │   └── tasks.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
├── package.json
├── package-lock.json
├── script.sh
├── manage.sh
├── build.sh
├── .env
├── .env.example
├── .gitignore
└── README.md
```

This is an example structure. Adjust it to match the actual repository.

## 5. Environment Configuration

Configure environment variables according to the requirements of your application.

### Frontend environment

Create a `.env` file in the project root:

```dotenv
VITE_API_URL=http://localhost:5000
```

The frontend can use this variable to communicate with the Express backend.

### Backend environment

Create a `.env` file inside the `backend/` directory:

```dotenv
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

Replace the example values with your actual configuration.

**Security requirements:**

- Never commit real `.env` files containing secrets.
- Never expose a Supabase service-role key in frontend code.
- Keep private API keys and credentials on the backend.
- Use the environment variable names expected by your application.
- Ensure environment variables are loaded before the application initializes its Supabase client.

## 6. Troubleshooting

### Node.js version incompatibility

Check the installed version:

```bash
node -v
```

Install a compatible version using NVM if required.

### Shell script permission denied

Run:

```bash
chmod +x script.sh manage.sh build.sh
```

### Shell script syntax errors

Check the scripts without executing them:

```bash
bash -n script.sh
bash -n manage.sh
bash -n build.sh
```

### Missing package configuration

Verify that the required package files exist:

```bash
ls -l package.json backend/package.json
```

### Port already in use

Check whether ports 5173 or 5000 are occupied:

```bash
sudo lsof -i :5173
sudo lsof -i :5000
```

Verify the process before stopping it, or configure a different port.

### Supabase connection errors

Verify the Supabase URL, credentials, environment variable names, database configuration, and network connection.

## 7. Important Notes

- Run shell scripts from the project root unless the script specifies otherwise.
- Ensure frontend and backend dependencies are installed before starting development.
- Configure Supabase before using database-dependent functionality.
- Frontend and backend environment variables must be configured separately.
- These scripts automate local development and builds; they do not automatically deploy the application to production.
- Confirm the actual commands supported by `manage.sh` before using the optional management commands listed above.