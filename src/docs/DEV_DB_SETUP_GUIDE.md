# Dev Database Setup Guide (with screenshots)

Steps to create your own development database on MongoDB Atlas and seed it with
sample data. It only requires the browser + `npm run seed`, so it works the same
on **macOS / Windows / Linux**.

> Put your screenshots in `images/dev-db-setup/`.
> Save each one with the filename shown in the `![...]` reference so it renders.

---

## Prerequisites

- A (free) [MongoDB Atlas](https://cloud.mongodb.com/) account
- Node.js (check with `node -v`)
- This repo cloned, with `npm install` already run inside `src/`

---

## STEP 1. Create a project

In Atlas, open the Organization menu (top-left) → "New Project" → enter a name
(e.g. `event-management`) → Create.

![STEP1 Create project](images/dev-db-setup/01-create-project.png)

---

## STEP 2. Create a cluster (M0 free tier)

"Create" → choose **M0 (Free)** → rename the Cluster Name to **`dev`** → Create.
It takes a few minutes to finish provisioning.

![STEP2 Create cluster (M0/dev)](images/dev-db-setup/02-create-cluster.png)

---

## STEP 3. Create a database user

Left menu **Database Access** → "Add New Database User"
- Authentication method: Password
- Set a Username / Password (Autogenerate is recommended — **be sure to save it**)
- Role: **Read and write to any database**

![STEP3 Create database user](images/dev-db-setup/03-database-user.png)

---

## STEP 4. Allow network access

Left menu **Network Access** → "Add IP Address" → **`0.0.0.0/0`** (allow from
anywhere) → Confirm.

> On NAT/proxy networks (e.g. school Wi-Fi) your real connection IP often differs
> from the detected one, so a specific IP may fail to connect. `0.0.0.0/0` is the
> reliable choice for development.

![STEP4 Allow network access](images/dev-db-setup/04-network-access.png)

---

## STEP 5. Get the connection string

Cluster → **Connect** → "Drivers" → copy the `mongodb+srv://...` string.

![STEP5 Copy connection string](images/dev-db-setup/05-connection-string.png)

---

## STEP 6. Create `.env.local`

Create `src/.env.local` and paste the connection string.
Make sure the **database name (after the `/`) is `dev`**.

```
MONGODB_URI="mongodb+srv://<user>:<password>@dev.xxxxx.mongodb.net/dev?retryWrites=true&w=majority&appName=dev"
```

- Replace `<user>` / `<password>` with the values from STEP 3
- If the password contains special characters (`@ : / ?` etc.), URL-encode them
- See `src/.env.example` for the expected format

> `.env.local` is git-ignored. **Never commit it.**

---

## STEP 7. Seed the database

```bash
cd src
npm install     # first time only
npm run seed
```

On success, the `users` / `events` collections in the `dev` database are
populated (they are cleared on each run). As a safety measure, seeding is
rejected if the database name looks like production.

![STEP7 Seed result](images/dev-db-setup/06-seed-result.png)

### Seeded test accounts

| Role  | Email                    | Password       |
| ----- | ------------------------ | -------------- |
| admin | `admin@eventhub.dev`     | `Admin123!`    |
| user  | `alex.chen@example.com`  | `Password123!` |

All regular users share the password `Password123!`.
`Intimate Jazz Night` has `maxAttendees: 3` (seeded to test the full-event flow).

---

## Troubleshooting

| Symptom | Cause / Fix |
| ------- | ----------- |
| `MongooseServerSelectionError` / `ReplicaSetNoPrimary` | Check that `0.0.0.0/0` is in Network Access. Right after cluster creation, wait ~30s and retry. |
| `SSL alert number 80` | Your IP is not allowed. Re-check STEP 4. |
| `MONGODB_URI is not set` | `src/.env.local` is missing/empty. Re-check STEP 6. |
| Auth error (`bad auth`) | Username/password don't match the connection string. Re-check STEP 3. |
