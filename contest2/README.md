# Portfolio Website With Admin Panel

Modern portfolio website built with Next.js, Prisma, SQLite, and a secure admin dashboard. The public site includes a responsive homepage, about section, skills, project grid, project detail pages, contact form, and social links. The admin panel lets you manage all core content without editing code.
## Stack

- Next.js 16 with App Router and TypeScript
- Tailwind CSS 4
- Prisma ORM with SQLite
- Server Actions for form handling and admin CRUD
- Secure admin login with hashed passwords and signed HTTP-only session cookies

## Features

- Responsive portfolio homepage
- About Me section
- Skills management
- Portfolio/projects management
- Project detail pages
- Contact section and contact form
- Social links management
- Admin login
- Add, edit, and delete projects
- Upload project images
- Manage site intro, about text, and contact info
- SEO-friendly metadata and server-rendered pages

## Admin Access

Default local admin credentials come from [.env.example](.env.example) and the local [.env](.env) used for development:

- Email: `admin@portfolio.local`
- Password: `ChangeMe123!`

Change these values before production deployment.
## Local Setup

1. Install dependencies:

	```bash
	npm install
	```

2. Create the database and generate the Prisma client:

	```bash
	npm run db:push
	```

3. Seed the portfolio content and admin user:

	```bash
	npm run db:seed
	```

4. Start the development server:

	```bash
	npm run dev
	```

5. Open the site at `http://localhost:3000`.

## Production Build

```bash
npm run build
npm start
```

## Deployment Notes

- This project is suitable for Node.js hosting where the app can write uploaded files to local disk.
- Uploaded images are stored in `public/uploads`.
- If you plan to deploy to a serverless platform, move uploads to object storage such as S3 or Cloudinary.
- Set a strong `SESSION_SECRET` and replace the default admin credentials before going live.

## Database

- SQLite database path: `prisma/dev.db`
- Prisma schema: [prisma/schema.prisma](prisma/schema.prisma)
- Seed script: [prisma/seed.ts](prisma/seed.ts)

## Important Paths

- Public homepage: [src/app/page.tsx](src/app/page.tsx)
- Project detail page: [src/app/projects/[slug]/page.tsx](src/app/projects/[slug]/page.tsx)
- Admin login: [src/app/admin/login/page.tsx](src/app/admin/login/page.tsx)
- Admin dashboard: [src/app/admin/page.tsx](src/app/admin/page.tsx)
- Admin actions: [src/app/admin/actions.ts](src/app/admin/actions.ts)

## Content Workflow

1. Sign in to `/admin/login`.
2. Update site text in the settings section.
3. Add or edit skills and social links.
4. Create, update, or delete portfolio projects.
5. Upload project images directly from the project forms.

Public pages revalidate after each admin save, so the site updates immediately.
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
