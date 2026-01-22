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


## Access Admin Panel to update news  

http://localhost:3000/admin-nbm-x492d/news 

to add a person in team page 
  {
    name: "E",
    role: "UX / UI Designer",
    desc: "Designs intuitive interfaces and elevates user experience across the platform.",
    img: "/person.png",
    linkedin: "#",
    email: "mailto:placeholder@example.com",
  },

  Production Setup Guide (Cloudflare Turnstile, Vercel, Google Sheets)

## Follow these steps only when deploying to production (Vercel / custom domain).
Do not change anything for local development.

1️⃣ Update Environment Variables (Production)

In Vercel → Project → Settings → Environment Variables, add the following:

MONGODB_URI=mongodb+srv://<USER>:<PROD_PASSWORD>@cluster0.cguiv68.mongodb.net/neurobiomark?retryWrites=true&w=majority

NEXT_PUBLIC_BASE_URL=https://your-domain.com

ADMIN_KEY=<LONG_RANDOM_SECRET>

GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=<GMAIL_APP_PASSWORD_NO_SPACES>

NEXT_PUBLIC_TURNSTILE_SITE_KEY=<PRODUCTION_SITE_KEY>
TURNSTILE_SECRET_KEY=<PRODUCTION_SECRET_KEY>

GOOGLE_SHEETS_ID=<SHEET_ID>
GOOGLE_SERVICE_ACCOUNT_EMAIL=<SERVICE_ACCOUNT_EMAIL>
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<PRIVATE_KEY_WITH_NEWLINES>


⚠️ Notes:

Never use .env.local in production

Do not prefix secrets with NEXT_PUBLIC_

Restart deployment after adding variables

2️⃣ Cloudflare Turnstile — Production Configuration
2.1 Edit Existing Widget

Go to:

Cloudflare Dashboard → Turnstile → Widgets

Select your existing widget (used for localhost).

2.2 Add Production Hostname

Click Add Hostnames and add:

your-domain.com


or if using Vercel default:

your-project.vercel.app


✅ Do not remove localhost
✅ Do not include protocol or port

2.3 Copy Production Keys

From the widget settings:

Copy Site Key

Copy Secret Key

Update them in Vercel Environment Variables:

NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...
TURNSTILE_SECRET_KEY=0x4AAAA...

3️⃣ Google Sheets — Production Access
3.1 Share Sheet with Service Account

Open your Google Sheet → Share → add:

<service-account-email>


Permission:

Editor

3.2 Verify Sheet Columns

Row 1 must match exactly:

Name | Email | IP | CreatedAt


Order matters.

4️⃣ Admin Dashboard & CSV Export (Production)
4.1 Admin Dashboard

Access:

https://your-domain.com/admin/demo-requests


Enter:

ADMIN_KEY


⚠️ This key must be kept secret

4.2 CSV Export Endpoint
GET /api/request-demo/export


Required header:

x-admin-key: ADMIN_KEY


or query (temporary use only):

/api/request-demo/export?key=ADMIN_KEY

5️⃣ Final Production Checklist

Before going live:

 MongoDB production password rotated

 Gmail App Password regenerated

 Admin key regenerated

 Turnstile hostname added

 Google Sheet shared correctly

 Environment variables set in Vercel

 No secrets committed to Git

6️⃣ Security Recommendations (Post-Launch)

Strongly recommended after launch:

Replace ADMIN_KEY with real auth (NextAuth / Clerk)

Add IP rate limiting (Upstash / Redis)

Restrict admin routes by role

Remove query-based admin key access

📌 Summary

Local setup → unchanged

Production → add domain hostname + env vars

Same Turnstile widget works for both

No code changes required