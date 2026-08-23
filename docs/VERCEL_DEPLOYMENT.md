# Vercel Deployment

## Framework
Vite + React 19 + TypeScript + Tailwind v4 + wouter (SPA). No framework migration.

## Import
Import the GitHub repo into Vercel. `vercel.json` at the repo root already defines framework, commands, output directory, SPA rewrites and security headers.

## Install command
```
pnpm install --frozen-lockfile
```
(pnpm 11.1.2 is pinned via `packageManager` in the root `package.json`.)

## Build command
```
pnpm --filter @workspace/2m-yapi-market run build
```
Runs sitemap generation + `vite build`.

## Output directory
```
2m-yapi-market/dist
```
(Repo-root deployment. Alternatively set the Vercel project **Root Directory** to `2m-yapi-market` and use output dir `dist` with build `pnpm build`.)

## Environment variables
| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `VITE_PUBLIC_SITE_URL` | public | recommended once domain known | canonical/OG URLs + generated sitemap domain |
| `VITE_API_BASE_URL` | public | optional | origin of a deployed quote-request API; without it the form fails gracefully and points visitors to WhatsApp |
| `VITE_BUSINESS_PHONE` / `VITE_WHATSAPP_PHONE` | public | optional | override built-in phone numbers |

No server-only variables are required for the static site. If the Express quote API (`api-server`, Postgres via Drizzle) is deployed later, configure `DATABASE_URL` as a **server-only** variable there — never with a `VITE_` prefix.

## SPA routing
All non-`/api/*` paths are rewritten to `/index.html` (`vercel.json`), so direct visits and refreshes of `/hizmetler`, `/iletisim` and every `/kusadasi-*` service route render correctly.

## Domain setup
Add the custom domain later in Vercel → Project → Settings → Domains, then set `VITE_PUBLIC_SITE_URL` to it and redeploy (this regenerates canonical URLs and `public/sitemap.xml`). Do not invent a domain before it exists.

## Secrets
None are committed. `.env*` files are git-ignored. See `.env.example`.
