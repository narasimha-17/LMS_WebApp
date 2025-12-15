LMS - Client (Next.js)

Minimal README to run the frontend (Next.js app) used in this repository.

Prerequisites
- Node.js 18+ (LTS recommended)
- npm (or pnpm/yarn)

Quick setup
```powershell
cd client
npm install
```

Run in development
```powershell
npm run dev
```

Build for production
```powershell
npm run build
npm start
```

Notes
- The frontend fetches data from the backend at `http://localhost:4000/api/certifications` by default. If your backend runs on a different host/port, update the fetch URL in `client/app/page.tsx` or set up a proxy.
- If you load remote images via `next/image`, `next.config.ts` contains `remotePatterns`. After editing `next.config.ts`, restart the dev server to apply changes.

Troubleshooting
- CORS errors: ensure the backend `CORS_ORIGIN` includes `http://localhost:3000` (or your frontend origin).
- Image load errors: confirm `next.config.ts` permits the image host and restart Next.js.

Files of interest
- `client/app/page.tsx` — main page that fetches and displays certifications.
- `client/next.config.ts` — Next.js config (remote images).

If you want me to add environment variable support (API base URL), I can add a `.env` example and read it in the client.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
