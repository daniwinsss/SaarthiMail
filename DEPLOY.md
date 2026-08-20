# Saarthi Mail — Deployment Guide

This guide deploys **Saarthi Mail** to **Vercel** as two separate projects
(frontend and backend). No custom domain required — we use the default
`*.vercel.app` subdomains.

> **Prerequisite:** a Vercel account linked to the GitHub repo, and a Google
> Cloud project with an OAuth 2.0 client (already in use locally). MongoDB
> Atlas and Groq credentials must be on hand.

---

## 1. Architecture

| Layer    | Vercel Project       | Root         | Output          | URL                                |
| -------- | -------------------- | ------------ | --------------- | ---------------------------------- |
| Backend  | `saarthi-mail-api`   | `server/`    | Serverless fn   | `https://saarthi-mail-api.vercel.app` |
| Frontend | `saarthi-mail`       | `client/`    | Static (`dist`) | `https://saarthi-mail.vercel.app`      |

The frontend talks to the backend via the `VITE_API_BASE_URL` build-time env
variable. The backend persists sessions in **MongoDB Atlas** via
`connect-mongo` (this is required because Vercel serverless functions have no
sticky sessions and no in-memory state across cold starts).

---

## 2. Pre-flight — code changes (already done in this repo)

These edits make the server deployable to a serverless environment:

| File                                       | Change                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| `server/app.js`                            | `cors` origin from `CLIENT_URL`; `app.set("trust proxy", 1)`; secure cookies; `MongoStore` session |
| `server/src/config/passport.js`            | OAuth `callbackURL` from `GOOGLE_CALLBACK_URL` env                              |
| `server/src/routes/auth.routes.js`         | Post-login redirect from `CLIENT_URL`; clears cookie on logout                 |
| `server/vercel.json`                       | Routes every request to `server.js` via `@vercel/node`                          |
| `server/package.json`                      | New dep: `connect-mongo@^6.0.0`                                                  |

> **Important:** the committed `server/.env` and `client/.env` are for local
> development only. **Rotate every secret** (Mongo, Google OAuth, Groq) before
> going live, and store the new values in Vercel's project env UI, never in
> the repo.

---

## 3. Google Cloud Console setup

1. Go to **APIs & Services → Credentials** → edit the OAuth 2.0 client.
2. Under **Authorized JavaScript origins** add:
   - `https://saarthi-mail.vercel.app`
   - `https://saarthi-mail-api.vercel.app`
3. Under **Authorized redirect URIs** add:
   - `https://saarthi-mail-api.vercel.app/api/auth/google/callback`
4. Save. (Keep the existing localhost entries for local dev.)

---

## 4. Deploy the backend

1. In Vercel, click **Add New → Project**, import the repo.
2. Configure:
   - **Project Name:** `saarthi-mail-api`
   - **Root Directory:** `server`
   - **Framework Preset:** Other
3. **Environment Variables** (add for `Production`):
   | Key                     | Value                                                                |
   | ----------------------- | -------------------------------------------------------------------- |
   | `MONGO_URI`             | (rotated Atlas connection string)                                    |
   | `GOOGLE_CLIENT_ID`      | (rotated)                                                            |
   | `GOOGLE_CLIENT_SECRET`  | (rotated)                                                            |
   | `GOOGLE_CALLBACK_URL`   | `https://saarthi-mail-api.vercel.app/api/auth/google/callback`       |
   | `SESSION_SECRET`        | (32+ random chars — `openssl rand -hex 32`)                          |
   | `GROQ_API_KEY`          | (rotated)                                                            |
   | `CLIENT_URL`            | `https://saarthi-mail.vercel.app` *(fill after step 5)*              |
   | `NODE_ENV`              | `production`                                                         |
   | `ENABLE_DEMO_LOGIN`     | `true` (see section 10)                                              |
   | `DEMO_USER_EMAIL`       | `demo@saarthimail.app`                                               |
4. Click **Deploy**. Copy the production URL, e.g.
   `https://saarthi-mail-api.vercel.app`.
5. Smoke test: open `https://saarthi-mail-api.vercel.app/` — should print
   `Saarthi mail api running`.

> **MongoDB Atlas:** add `0.0.0.0/0` to the IP allowlist (Vercel egress IPs
> rotate). For production-grade, use Atlas's Vercel integration or a NAT
> gateway.

---

## 5. Deploy the frontend

1. Vercel → **Add New → Project**, same repo, **second** project.
2. Configure:
   - **Project Name:** `saarthi-mail`
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Environment Variables**:
   | Key                 | Value                                          |
   | ------------------- | ---------------------------------------------- |
   | `VITE_API_BASE_URL`       | `https://saarthi-mail-api.vercel.app`    |
   | `VITE_ENABLE_DEMO_LOGIN`  | `true` (see section 10)                  |
4. Click **Deploy**. Note the URL, e.g. `https://saarthi-mail.vercel.app`.
5. Go back to **Project 1 (`saarthi-mail-api`) → Settings → Environment
   Variables**, set `CLIENT_URL` to that frontend URL, then **Redeploy** the
   backend (without this, the OAuth post-login redirect will point to
   localhost and the CORS check will fail).

---

## 6. End-to-end verification

1. Visit `https://saarthi-mail.vercel.app/` — UI loads.
2. Click **Login with Google** — OAuth round trip lands back on `/inbox`.
3. Hit `https://saarthi-mail-api.vercel.app/api/auth/status` in a logged-in
   browser — returns `{ isAuthenticated: true, user: {...} }`.
4. Trigger an authenticated request from the UI (e.g. load inbox) — no CORS
   error in DevTools, no `secure cookie over HTTP` warning.
5. In a fresh incognito window, click **Explore the live demo** — lands on
   `/inbox` with the seeded emails and a `Demo · read-only` badge.

---

## 7. Local development

> **The server reads `server/.env` only.** `server/server.js` calls a bare
> `dotenv.config()`, which resolves relative to the working directory, and
> `npm run dev` runs from `server/`. A `.env` at the repo root is **never
> loaded** — putting credentials there produces an empty `MONGO_URI` and a
> `connect-mongo` assertion at boot.

`server/.env` (local) — keep these for `npm run dev`:

```env
MONGO_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SESSION_SECRET=any-dev-secret
GROQ_API_KEY=...
CLIENT_URL=http://localhost:5173
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
NODE_ENV=development
PORT=5000

# Read-only demo (section 10)
ENABLE_DEMO_LOGIN=true
DEMO_USER_EMAIL=demo@saarthimail.app

# Optional, local only — see "DNS" below
DNS_SERVERS=1.1.1.1,8.8.8.8
```

**DNS.** If startup fails with
`querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net`, the Atlas cluster
is fine — Node simply cannot reach a working nameserver. Node/c-ares queries
resolvers directly rather than going through the OS stub resolver, so a stale
`127.0.0.1` entry (left by a local DNS filter or an inactive VPN) refuses every
lookup while the browser keeps working. Setting `DNS_SERVERS` makes
`server/src/config/dns.js` point Node at resolvers that answer. **Leave it
unset in Vercel** — DNS works there and the branch is skipped.

`client/.env` (local):

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run two terminals:

```bash
cd server && npm run dev
cd client && npm run dev
```

---

## 8. Common failure modes

| Symptom                                                       | Likely cause                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------ |
| `401` on every request after login                            | Session store not persisting — check `connect-mongo` is wired, Atlas reachable |
| CORS error in browser                                         | `CLIENT_URL` on backend ≠ actual frontend origin              |
| OAuth callback goes to `localhost:5173`                       | `GOOGLE_CALLBACK_URL` not set, or `CLIENT_URL` not set on backend |
| `Cannot set headers after they are sent`                      | Missing `app.set("trust proxy", 1)` behind Vercel proxy      |
| First request takes 3+ seconds                                | Cold start of serverless function — expected, harmless       |
| Logout doesn't clear session                                  | Make sure `res.clearCookie("connect.sid")` is called         |

---

## 9. Notes for going beyond `*.vercel.app`

When you're ready for a custom domain, you only need to:

1. Add the domain to **both** Vercel projects (frontend + backend get
   subdomains like `app.example.com` and `api.example.com`).
2. Update the env vars (`VITE_API_BASE_URL`, `CLIENT_URL`,
   `GOOGLE_CALLBACK_URL`) to the new URLs.
3. Add the new origins/redirects in Google Cloud Console.
4. Redeploy both.

No code changes required.

---

## 10. The public read-only demo

Google keeps the OAuth app in *Testing* mode because it requests the restricted
`gmail.readonly` and `calendar` scopes, so **only accounts listed under Test
users on the consent screen can sign in with Google**. Publishing the app would
require Google verification (including a security assessment).

The demo login is the way around that for anyone who just wants to look at the
project. It creates a Passport session for a synthetic user
(`server/src/config/demoUser.js`) with `isDemo: true` and no Google token — no
Google account is involved at any point.

**Enabling it**

| Where                   | Key                      | Value                   |
| ----------------------- | ------------------------ | ----------------------- |
| `saarthi-mail-api`      | `ENABLE_DEMO_LOGIN`      | `true`                  |
| `saarthi-mail-api`      | `DEMO_USER_EMAIL`        | `demo@saarthimail.app`  |
| `saarthi-mail` (client) | `VITE_ENABLE_DEMO_LOGIN` | `true`                  |

Set `ENABLE_DEMO_LOGIN` to anything else and `POST /api/auth/demo` returns 404;
unset `VITE_ENABLE_DEMO_LOGIN` and the button disappears from `/auth`.

**Seeding the demo inbox**

The demo reads real `Email` documents owned by `DEMO_USER_EMAIL`. Seed them once
after deploy, pointing `MONGO_URI` at the production database:

```bash
cd server
MONGO_URI="<production Atlas URI>" DEMO_USER_EMAIL="demo@saarthimail.app" npm run seed:demo
```

The script is idempotent — it deletes every existing demo-owned email first, so
re-run it any time the demo inbox needs resetting.

**What the demo cannot do**

`ensureAuthenticated` now guards all of `/api/mail` and `/api/gmail`, and
`blockDemoWrites` (`server/src/middlewares/auth.middleware.js`) returns `403`
for a demo session on `POST /api/mail`, `PUT`/`DELETE /api/mail/:id`, and
`POST /api/mail/calendar/create`. Gmail sync returns a `403` explaining it is
disabled; `GET /api/gmail/message/:id` serves the seeded copy from Mongo instead
of calling Google. AI summaries, suggested replies, and meeting detection all
still run live — only the write-back of a generated reply is suppressed, so the
seeded inbox stays pristine for the next visitor.
