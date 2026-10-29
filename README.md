# shobhit-portfolio

My personal site. Next.js 16 (App Router), React 19, Tailwind 4, Framer Motion. One narrow 562px column, three colours (`#FFE7D0` cream, `#FC6E20` orange, `#323232` charcoal), Outfit + Urbanist.

The site has two live parts besides the static content.

## Proof of Work

A live feed of what I'm actually doing on GitHub, so you don't have to take my resume's word for it.

```
GitHub webhook ──► /api/pow/github/webhook ──► Neon Postgres (pow_events, last 4 days)
                          │                            │
                          └──► Google Calendar         └──► /api/pow/feed ──► homepage (polls every 30s)
                               (permanent history)
```

- The webhook verifies `x-hub-signature-256` with HMAC-SHA256 and maps pushes, PRs, CI runs and releases to `PowEvent`s ([app/lib/pow/github.ts](app/lib/pow/github.ts)).
- Events are upserted on a `dedupe_key`, so GitHub redeliveries don't create duplicates ([app/lib/pow/db.ts](app/lib/pow/db.ts)).
- Postgres is hot storage only. A cron hits `/api/pow/retention` to drop anything older than 4 days; the long-term record lives in a public Google Calendar ([app/lib/pow/googleCalendar.ts](app/lib/pow/googleCalendar.ts)).
- Schema: [neon/pow_events.sql](neon/pow_events.sql).

## Now playing

`/api/spotify/now-playing` uses a stored refresh token to show whatever I'm listening to. `/api/spotify/auth` and `/api/spotify/callback` exist only to get that token once.

## Drawer

`/drawer` is a personal feed of thoughts, photos, clips and songs. Items live in the `drawer_items` table ([neon/drawer_items.sql](neon/drawer_items.sql)); files live in Cloudflare R2.

- **Posting from Telegram:** messages to the bot hit `/api/drawer/telegram` (checked with `TELEGRAM_WEBHOOK_SECRET`, and only `TELEGRAM_OWNER_ID` can post). Files are copied from Telegram into R2. Bots can only download files up to 20 MB.
- **Admin page:** `/drawer/admin`, behind `DRAWER_ADMIN_PASSWORD`. Files upload straight from the browser to R2 with presigned URLs, so size isn't limited by Vercel. Song waveforms are computed in the browser.
- **Sharing:** every item has `/drawer/<id>` with a generated preview image.

## Content

Everything editable lives in `app/data/`:

| File | What |
| --- | --- |
| `strings.ts` | All UI copy |
| `projects.ts` | Project cards + detail pages |
| `experience.ts` | Experience timeline + detail pages |
| `blogs.ts` | Blog posts (HTML strings) |

## Running it

```bash
npm install
npm run dev
```

The static site runs without any env vars. The live sections need:

| Variable | For |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `GITHUB_WEBHOOK_SECRET` | Webhook signature check |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` | Writing events to Calendar (get the refresh token via `/api/google/auth`) |
| `POW_CALENDAR_PUBLIC_URL` | Where "open calendar" points |
| `POW_RETENTION_TOKEN` | Auth for the retention cron |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | Now playing |
| `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | Drawer file storage (Cloudflare R2, S3 API) |
| `R2_PUBLIC_URL` | Public URL of the R2 bucket (r2.dev or custom domain) |
| `DRAWER_ADMIN_PASSWORD` | Login for `/drawer/admin` |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_OWNER_ID` | Posting to the drawer from Telegram |
| `NEXT_PUBLIC_SITE_URL` | Optional override for the canonical URL (defaults to https://shobhitsrivastava.com) |
