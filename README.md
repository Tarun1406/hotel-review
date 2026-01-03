# Hotel Review (hotel-review)

This project contains a small React frontend (`client`) and a Node + Express backend (`server`) that stores reviews in MongoDB.

This README explains how to run the project locally, common troubleshooting steps, and optional improvements.

---

## Project layout

- `client/` — React app (create-react-app / react-scripts)
- `server/` — Express API (uses Mongoose to connect to MongoDB Atlas)

# Hotel Review

This repository contains a small full‑stack example project:

- `client/` — React frontend (Create React App)
- `server/` — Node + Express backend (uses Mongoose to talk to MongoDB)

This README shows how to set up and run the project locally on macOS, Linux and Windows, links to required downloads, and includes troubleshooting tips.

## Table of contents
- Prerequisites (links & versions)
- Quick start (macOS / Linux / Windows)
- Environment variables and `.env` files
- Running client & server
- Development tips (concurrently, build)
- Git / pushing notes (SSH vs HTTPS, common push problems)
- Troubleshooting & FAQs
- Useful links

## Prerequisites

- Node.js: v16 or v18 LTS is recommended for Create React App and many toolchains. Avoid very new Node versions unless you know the toolchain supports them.
  - Download: https://nodejs.org/
  - Use nvm (macOS/Linux) or nvm-windows for multiple Node versions:
    - nvm (macOS/Linux): https://github.com/nvm-sh/nvm
    - nvm-windows (Windows): https://github.com/coreybutler/nvm-windows
- npm (comes with Node) or yarn (optional)
- MongoDB Atlas account or a local MongoDB server

Windows-specific notes
- Use PowerShell or Windows Terminal for commands below. When setting environment variables persistently on Windows prefer a `.env` file (the project reads `.env`) or use `setx` from an elevated PowerShell. Avoid relying on `export VAR=...` in PowerShell — that is a bash/zsh syntax.

Verify installation

```bash
node -v
npm -v
```

If you see versions printed, Node/npm are available.

## Quick start (local)

Follow these steps from the project root (the folder that contains `client/` and `server/`). Examples use bash/zsh syntax; Windows PowerShell commands are included where different.

1) Clone (if you haven't already)

```bash
git clone https://github.com/Tarun1406/hotel-review.git
cd hotel-review
```

2) Backend setup (server)

```bash
cd server
npm install
```

Create a `.env` file inside `server/`. Example `.env` (do not commit real secrets):

```
PORT=8080
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/hotelreview?retryWrites=true&w=majority
```

Notes for Windows PowerShell users: create the file with Notepad or PowerShell's `Set-Content`:

```powershell
Set-Content -Path .\.env -Value "PORT=8080`nMONGO_URI=your_connection_string"
```

Start the server (development):

```bash
npm run dev
# or on Windows PowerShell run the same command from the server folder
```

3) Frontend setup (client)

Open a new terminal and from the project root:

```bash
cd client
npm install
npm start
```

This will start the React dev server on `http://localhost:3000` by default. The client expects a backend at `http://localhost:8080`. If you change the server port, update the fetch URLs in the client or set up a proxy.

4) Run both together (optional)

From the project root you can run server and client in parallel with `concurrently`:

```bash
# install once (project root)
npm install -g concurrently
# then in project root
concurrently "cd server && npm run dev" "cd client && npm start"
```

Or add a root-level `package.json` script that runs both as dev dependencies.

Run both (one-command)

If you want a single command to start both services from the project root, use the provided root script. First make sure dependencies for `server` and `client` are installed (one-time):

```bash
# from project root
cd server && npm install
cd ../client && npm install
# install root dev dependencies (concurrently)
npm install
```

Then start both in parallel:

```bash
npm run dev
```

This runs the `dev` script in the root `package.json`, which launches the server and the React dev server together.

## Environment variables & `.env`

- The backend reads connection settings from `server/.env` (see `server/index.js` or code for exact names). Prefer `MONGO_URI` with the full connection string.
- Never commit real credentials. Add `.env` to `.gitignore` (the repo likely already does).
- Consider adding `server/.env.example` with variable names (no secrets) to help other contributors.

## Git / pushing to GitHub

Common problem: pushing fails with 403 or `Permission denied (publickey)`. This happens when your local Git credentials belong to a different GitHub account or your SSH key is not configured.

Two recommended approaches:

- SSH (recommended):
  - Generate an SSH key (if you don’t have one):

```bash
# macOS / Linux
ssh-keygen -t ed25519 -C "your-email@example.com"
# Windows (PowerShell) - same command in Git Bash or Windows terminal
```

  - Add the key to the ssh-agent and to your GitHub account. On macOS you can use the keychain:

```bash
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
pbcopy < ~/.ssh/id_ed25519.pub     # macOS: copy public key
cat ~/.ssh/id_ed25519.pub | clip   # Windows (PowerShell): copy public key
```

  - Add the public key to https://github.com/settings/keys
  - Change your repo remote to use SSH:

```bash
git remote set-url origin git@github.com:Tarun1406/hotel-review.git
git push -u origin main
```

- HTTPS + PAT (if you prefer HTTPS):
  - GitHub requires a Personal Access Token (PAT) for command-line pushes. Create one at https://github.com/settings/tokens (repo scope).
  - Clear any cached wrong credentials (macOS uses the Keychain; Windows may use the credential manager). Then push and provide your username and PAT when prompted.

If you see an error like `remote: Permission to owner/repo.git denied to otheruser` you are authenticating as the wrong GitHub account — switch SSH keys or clear the stored HTTPS credentials.

## Troubleshooting & FAQs

- I can't push, I get 403 and the username is not mine
  - Likely using cached HTTPS credentials for a different user. Clear stored credentials in Keychain (macOS) or Credential Manager (Windows), or switch to SSH.

- `react-scripts: command not found` when running `npm start` in `client`
  - Ensure `react-scripts` is listed in `client/package.json` and run `npm install` inside `client`. If you upgraded Node recently, try using Node 16/18 via nvm.

- Build errors mentioning `ajv` / schema-utils
  - Some older toolchain packages expect older `ajv` APIs. Installing `ajv@6` and `ajv-keywords@3` as dev dependencies solved issues in some environments. Check the project commit history for notes.

- MongoDB connection fails
  - Check `MONGO_URI` in `server/.env`, whitelist your IP in Atlas, and confirm the user/password are correct.

## Useful links

- Node.js downloads: https://nodejs.org/
- nvm (macOS / Linux): https://github.com/nvm-sh/nvm
- nvm-windows: https://github.com/coreybutler/nvm-windows
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- GitHub SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Creating a PAT: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

