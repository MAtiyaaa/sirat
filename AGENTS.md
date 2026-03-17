# AGENTS.md

## Cursor Cloud specific instructions

### Overview
Sirat is a bilingual (Arabic/English) Islamic SPA built with React 18 + Vite + TypeScript + shadcn/ui + Tailwind CSS. The backend is hosted Supabase (auth, database, edge functions); no local backend services are needed. External APIs (AlQuran.cloud, Aladhan, etc.) are called from the browser.

### Dev commands
All commands are in `package.json`:
- **Dev server:** `npm run dev` (Vite on port 8080, host `::`)
- **Lint:** `npm run lint` (ESLint; exits non-zero due to pre-existing warnings/errors in the codebase)
- **Build:** `npm run build`
- **Preview:** `npm run preview`

### Non-obvious notes
- The `.env` file with Supabase credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) is already committed. No extra secrets are needed for basic frontend dev.
- Both `package-lock.json` (npm) and `bun.lock` exist; use **npm** for consistency with the update script.
- No test framework is configured (no jest/vitest); `npm test` does not exist. Validation is done via lint, build, and manual browser testing.
- The ESLint config (`eslint.config.js`) uses flat config format (ESLint 9). Pre-existing lint errors exist in the codebase and are not introduced by cloud agent work.
- Supabase Edge Functions (in `supabase/functions/`) run on Supabase's infrastructure. They are NOT run locally during development.
