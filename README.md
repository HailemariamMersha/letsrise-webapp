# Letsrise Webapp

## Overview
Letsrise is a venture intelligence platform that helps accelerators post their openings and enables entrepreneurs to apply. The platform also supports identity assessments, courses, founder/team matching, and more. Our main revenue stream is helping accelerators attract and filter qualified applications, making the process more consistent, unbiased, and efficient.

## Features
- **Role Selection:** Users choose to continue as Entrepreneur, Accelerator, or Investor after login.
- **Entrepreneur Experience:**
  - Identity assessment with beautiful personalized reports
  - Course participation
  - Team/founder matching (planned)
- **Accelerator Experience:**
  - Post openings (coming soon)
  - Filter and evaluate applicants (coming soon)
- **Investor Experience:**
  - Discover startups and track cohorts (coming soon)
- **Admin Dashboard:**
  - User, assessment, report, course, subscription, log, and analytics management
  - Role-based access control
- **PostgreSQL Database:**
  - Prisma ORM for schema and migrations
  - Secure storage of assessment results and user data

## Folder Structure
```
.
├── components/         # Reusable UI components (AdminTable, AdminCard, etc.)
├── context/            # React context (AuthContext)
├── lib/                # Backend utilities (db, Prisma, Firebase, etc.)
├── pages/              # Next.js pages (admin, api, assessment, etc.)
├── styles/             # Tailwind CSS
├── prisma/             # Prisma schema and migrations
├── .env.local          # Environment variables (not committed)
├── README.md           # This documentation
```

## Setup Instructions
1. **Clone the repo:**
   ```sh
   git clone git@github.com:HailemariamMersha/letsrise-webapp.git
   cd letsrise-webapp
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` (create `.env.example` if needed)
   - Add your Firebase and PostgreSQL credentials:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
     DATABASE_URL=postgresql://username:password@localhost:5432/letsrise
     ```
4. **Set up the database:**
   - Install PostgreSQL locally or use a managed service
   - Run Prisma migrations:
     ```sh
     npx prisma migrate dev
     ```
5. **Run the app locally:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

## Database Workflow (Prisma)
- All schema changes are made in `prisma/schema.prisma`.
- Run `npx prisma migrate dev --name <migration-name>` to create and apply migrations.
- Commit and push your schema and migration files.
- Other developers pull and run `npx prisma migrate dev` to sync their local DB.
- Never commit `.env.local` or actual database files.

## Environment Variables
- Store all secrets (Firebase, DB, etc.) in `.env.local` (gitignored).
- Example:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=your-key
  DATABASE_URL=postgresql://user:pass@localhost:5432/letsrise
  ```

## Running Locally
- Visit `http://localhost:3000` after running `npm run dev`.
- After login, select your role (Entrepreneur, Accelerator, Investor).
- Admins can access `/admin` for the full dashboard.

## Deployment Notes
- Set all environment variables in your deployment platform (Vercel, Heroku, etc.).
- Use a managed PostgreSQL database for production.
- Never expose secrets in the repo.

## Contribution Guidelines
- Use feature branches and pull requests.
- Keep all secrets out of the repo.
- Use `npx prisma migrate dev` for DB changes.
- Keep code modular and well-documented.

## License
MIT
