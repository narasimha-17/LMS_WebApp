# LMS - Server (Express)

This README explains how to set up and run the backend in `server/`. The repository includes two server entry points:

- `index.js` — the working Express server that uses `mysql2` (raw SQL) to query the `certification` table.
- `index.prisma.js` — a Prisma-backed Express server (experimental). You can use this instead of `index.js` after installing and generating the Prisma client.

Prerequisites
- Node.js 18+ (LTS recommended)
- MySQL server with the database referenced by `DATABASE_URL` (see below)

Setup
```powershell
cd server
npm install
# generate Prisma client (only needed if you want to run the Prisma server)
npx prisma generate --schema=prisma/schema.prisma
```

Environment (.env)
Ensure `server/.env` exists with at least:

```
DATABASE_URL=
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

Run the mysql2 server (default, working)
```powershell
node index.js
```

Run the Prisma-backed server (experimental)
```powershell
# Ensure you have generated the client (see setup)
node index.prisma.js
```

API endpoints
- `GET /api/certifications` — returns JSON: `{ success:true, count, data: [...] }`

Notes about Prisma issues you may encounter
- If `index.prisma.js` fails with a Prisma client / runtime error:
  - Make sure `@prisma/client` is installed in `server/node_modules`: `npm install @prisma/client`
  - Re-run `npx prisma generate --schema=prisma/schema.prisma` to ensure compatible generated client artifacts.
  - Ensure `DATABASE_URL` is set and points to a reachable MySQL server.
  - Common errors: "PrismaClientInitializationError" — try reinstalling `@prisma/client` and regenerating client files.

Useful commands (PowerShell)
```powershell
# Install deps
cd server
npm install

# Generate Prisma client (when using Prisma)
npx prisma generate --schema=prisma/schema.prisma

# Run Express (mysql2)
node index.js

# Run Express (Prisma)
node index.prisma.js
```

Troubleshooting
- If you see CORS errors in the browser, confirm `CORS_ORIGIN` in `.env` matches your frontend origin.
- If Prisma can't find generated runtime files, delete `node_modules/@prisma/client` and re-install then re-run `prisma generate`.
- If the server cannot reach MySQL, verify connection details and that MySQL is running and accessible.

If you want I can also:
- Add npm scripts to `server/package.json` (`start`, `start:prisma`, `dev`).
- Create a sample `.env.example` in `server/`.
