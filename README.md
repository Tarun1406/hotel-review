# Hotel Review (hotel-review)

This project contains a small React frontend (`client`) and a Node + Express backend (`server`) that stores reviews in MongoDB.

This README explains how to run the project locally, common troubleshooting steps, and optional improvements.

---

## Project layout

- `client/` — React app (create-react-app / react-scripts)
- `server/` — Express API (uses Mongoose to connect to MongoDB Atlas)

---

## Prerequisites

- Node.js (v16+ recommended) and npm
- MongoDB Atlas account (or a local MongoDB instance)
- macOS (zsh) commands shown below — adjust for other shells/OS

Verify Node/npm:

```bash
node -v
npm -v
```

---

## Backend (server) — setup & run

1. Open terminal and change to the server folder:

```bash
cd /Users/tarunsangule/Coding/JavaDevelopment/Java-playground/hotel-review/server
```

2. Create a `.env` file in the `server/` folder with your MongoDB credentials. Example (Atlas):

```
mongo_user_name=yourAtlasUser
mongo_password=yourAtlasPassword
PORT=8080
```

> Note: If you prefer, use a single `MONGO_URI` env var instead:
>
> `MONGO_URI="mongodb+srv://<user>:<password>@cluster0.o14lsej.mongodb.net/hotelreview?retryWrites=true&w=majority"`
>
> If your password includes special characters, URL-encode it (or use `encodeURIComponent` in code).

3. Install dependencies:

```bash
npm install
```

4. Start the server in development mode (nodemon):

```bash
npm run dev
```

5. Confirm server is running:

- You should see `connected to DB!` (if the DB connection succeeded).
- You should see `server running at 8080`.

If you want `npm start` to work (used by the provided `Procfile`), add a `start` script in `server/package.json` such as:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

Then `npm start` will run the server (production mode).

---

## Frontend (client) — setup & run

1. Open another terminal window/tab and change to the client folder:

```bash
cd /Users/tarunsangule/Coding/JavaDevelopment/Java-playground/hotel-review/client
```

2. Install dependencies:

```bash
npm install
```

3. Start the React dev server:

```bash
npm start
```

This opens the app at `http://localhost:3000` (or you can open it manually).

The client expects the backend API at `http://localhost:8080` (see `client/src/components/addReview/AddReview.jsx`). Keep the server running on port 8080 or change the fetch URLs accordingly.

---

## Run both together

Use two terminals (one for server, one for client). Alternatively, use `concurrently` from the repository root:

```bash
# install concurrently globally or as a dev dependency
npm install -g concurrently
# from project root (one level up from client/server)
concurrently "cd server && npm run dev" "cd client && npm start"
```

---

## Endpoints (quick reference)

- GET `/` — root endpoint
- GET `/review?location=&hotel=` — get a single review
- GET `/reviews?location=` — get reviews for a location
- POST `/review` — create a review (JSON body expected)
- GET `/locations` — list locations
- GET `/hotels?location=` — list hotels for a location

Use Postman or your browser to test these endpoints.

---

## MongoDB Atlas quick notes

1. Create a free cluster in Atlas.
2. In **Database Access**, add a DB user (username/password).
3. In **Network Access**, whitelist your IP (or use `0.0.0.0/0` for quick testing).
4. Copy the connection string and place credentials in `.env` as `mongo_user_name` and `mongo_password` (or provide `MONGO_URI` directly).

---

## Troubleshooting

- `connected to DB!` not printed: check `.env` values, whitelist your IP, ensure username/password correct.
- `ECONNREFUSED` on ports: make sure the process is running on that port and no other service is occupying it.
- CORS issues: server already sets CORS to `*`; check network tab for exact errors.
- If `npm start` fails in `server` folder, add a `start` script to `server/package.json` as shown above.

---

## Optional improvements (recommended)

- Use a single `MONGO_URI` env var instead of separate username/password.
- Add `.env.example` (without real secrets) to show required env names.
- Add a root-level script (`package.json`) using `concurrently` to start client+server.
- Add tests for backend endpoints (Jest / Supertest) and frontend (React Testing Library).

---

If you want, I can:
- Add `start` script to `server/package.json` so `Procfile` works locally and on cloud platforms.
- Create `.env.example` in `server/`.
- Add a root-level `package.json` script that runs both client and server with `concurrently`.

Tell me which follow-up you'd like and I'll implement it.
