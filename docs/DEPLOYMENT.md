# Deploying vsource.dev

Everything needed to take this site from the repo to production on Vercel,
with Payload on Neon Postgres and media in Vercel Blob. It is written for
whoever does the deploy, who may not be whoever built it.

The Coolify setup this replaces (`Dockerfile`, `output: 'standalone'`, the
`development → staging → production` workflow) is left over and ignored by
Vercel. Do not build on it.

---

## 1. How it ships

- **Vercel, from GitHub.** The production branch is `main`. Every push to
  `development` gets a preview deployment.
- **Promotion is Simon merging `development` into `main`**, and nobody else.
- `vercel.json` sets the build command to **`pnpm build:deploy`**. Do not
  override it in the project settings. It:
  1. refuses to run if `DATABASE_URL` is missing or is not a postgres
     connection string, or if `PAYLOAD_PUSH=1` is set;
  2. applies any new migrations to that environment's database
     (`src/db/deploy-migrate.ts`), and fails the build on any migration error;
  3. runs `next build`.
- **The build reads the database.** Every public page is statically rendered
  from Payload content, so `next build` needs a migrated **and seeded**
  database. A build against an empty one fails on the first required photo
  (`Content: … has no image. Set it in /admin.`). That failure is on purpose:
  a loud build failure is better than a page with holes in it.

## 2. Databases — two Neon branches, never shared

| Neon branch | Used by |
| --- | --- |
| **production** | the Production environment on Vercel, and nothing else |
| **preview** | Vercel Preview deployments **and** local development (`.env.local`) |

⚠️ **Preview deployments must never point at the production database.** A
preview build migrates whatever `DATABASE_URL` it has, so a preview pointed
at production would apply an unmerged branch's migrations to the live site.
Preview and local development share the preview branch on purpose. Migrating
and seeding it is normal.

Schema changes are **migrations only** (`src/db/migrations`). Dev push is off
unless `PAYLOAD_PUSH=1`, which is for a throwaway database and is refused by
the deploy build.

## 3. Environment variables

Set per environment in Vercel (Project → Settings → Environment Variables).
None of them live in the repo.

| Variable | Production | Preview | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | production branch | preview branch | Never the same value. See §2 |
| `PAYLOAD_SECRET` | its own | its own | Long random string. Changing it signs everyone out of /admin |
| `BLOB_READ_WRITE_TOKEN` | production store | preview store | Media uploads go to Blob when it is set (§5) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.vsource.dev` | the preview URL | Payload's CORS origin. Compiled in at build |
| `RESEND_API_KEY` | ✓ | ✓ | Contact form (§8) |
| `CONTACT_TO_EMAIL` | ✓ | ✓ | Where enquiries land |
| `CONTACT_FROM_EMAIL` | ✓ | ✓ | Must be on the domain verified in Resend |
| `TURNSTILE_SECRET_KEY` | ✓ | ✓ | Cloudflare Turnstile secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✓ | ✓ | Compiled in at build |

`NEXT_PUBLIC_*` values are inlined by `next build`, not read at runtime. After
changing one, **redeploy**. Then check that the Turnstile widget actually
renders on `/contact`. A missing key errors nowhere; the widget is simply
absent.

## 4. First production deploy — in this order

The order differs from "deploy, then seed": the build needs content (§1), so
the database is migrated and seeded **before** the first deploy that has to
succeed.

1. **Environment.** Create the Neon production branch and the production Blob
   store. Set every Production variable in §3.
2. **Migrate production** from a laptop, with the production values in the
   shell only for this command (not in `.env.local`):

   ```bash
   DATABASE_URL="<production>" NODE_ENV=production pnpm payload run ./src/db/deploy-migrate.ts
   ```

3. **Seed production**, with the production Blob token set, so the seed's
   files go straight into the production store:

   ```bash
   DATABASE_URL="<production>" BLOB_READ_WRITE_TOKEN="<production store>" pnpm seed
   ```

   It is idempotent: run it again and it reports `0 created, 0 updated`.
4. **Deploy.** Merge to `main`. `build:deploy` finds nothing to migrate and
   builds from the seeded content.
5. **Accounts.** `pnpm user` creates them and prints a generated password once.
   Do this before anything else touches `/admin`, because an empty users
   table means `/admin` offers to create the first account to anyone:

   ```bash
   DATABASE_URL="<production>" pnpm user simon@… admin --generate
   DATABASE_URL="<production>" pnpm user <editor's email> editor --generate
   ```

6. **Upload the real portraits** in `/admin` → Crew (4:5, at least
   1200×1500, colour). Craig, Simon and Ronan show the terminal tile until
   then. Tom keeps his tile permanently.

## 5. Media — Vercel Blob

- With `BLOB_READ_WRITE_TOKEN` set, uploads go to that environment's Blob
  store and media URLs are Blob CDN addresses. The browser uploads directly
  to Blob, which gets around Vercel's 4.5MB function body limit.
- Without it (local development), uploads are written to `public/media/`,
  which is gitignored, and served from `/media/<file>`.
- ⚠️ **A media row records a file name, not a location.** A row created
  without a token (in `public/media` on someone's laptop) becomes a Blob URL
  on any deployment that has a token, and the file is not there. So anything
  seeded or uploaded locally into the shared preview database shows as a
  broken image on preview deployments until the file is in Blob. Seed with
  the right token set (as in §4), or move the files across. The starter's
  `pnpm media:blob` does that, but it is not in this repo yet.
- Images are optimised by Vercel. Do not add `unoptimized`.

## 6. Editing, and what is not editable

- **Editors** change words and photographs on what exists. **Admins** also
  create and delete streams, projects, people and partners, change slugs, and
  manage accounts.
- A save in `/admin` is on the site at the next page load. No deploy is
  needed. A **project** saved as a draft is not on the site until it is
  published.
- A **new stream** needs a redeploy (its page is generated at build) and a
  stream mark, which is drawn in code.
- Some things stay in code and need a deploy, because a bad edit to them is a
  factual or legal problem: the `/regulated` and `/accessibility` pages, the
  shared "Whichever one you arrive through" list, contact details, and the
  rotating headline.
- `pnpm seed` against a database that has been edited in `/admin` **refuses**
  and lists the rows it would overwrite. `--force` overrides that. Once the
  site is live, the database is the source of truth.
- After a seed against a deployed database, **redeploy**. The seed cannot
  clear a deployment's cache from a laptop.

## 7. DNS

- **Only the apex (`vsource.dev`) and `www`** point at Vercel. Set them as
  Vercel's domain settings show. DNS is at Hostinger.
- **Resend's `send.vsource.dev` records (DKIM, SPF, MX) stay in Hostinger,
  untouched.** Moving or deleting them stops the contact form sending.
- Microsoft 365 mail on the root domain (`MX`, the `-all` SPF record) is not
  touched either.
- Lower the TTL a day beforehand if you want a fast rollback.

## 8. Resend sending domain

### Why a subdomain

`vsource.dev` already has Microsoft 365 mail on it, with a hard-fail SPF record:

```
MX   vsource.dev  ->  vsource-dev.mail.protection.outlook.com
TXT  vsource.dev  ->  v=spf1 include:spf.protection.outlook.com -all
```

That `-all` rejects anything sent from the root domain that is not Microsoft.
Verifying the root domain in Resend would mean editing that record and putting
company email at risk. A sending subdomain avoids the problem entirely and keeps
transactional sending reputation separate from business mail.

### Steps

1. In Resend, add domain **`send.vsource.dev`**, region **Tokyo (ap-northeast-1)**
   — closest region to Brisbane.
2. Resend issues four records. Add them in Hostinger's DNS zone editor, exactly
   as Resend shows them:

   | Type | Name | Value | TTL | Priority |
   | --- | --- | --- | --- | --- |
   | TXT | `resend._domainkey.send` | the full `p=MIGfMA…QIDAQAB` key | 3600 | — |
   | MX | `send.send` | `feedback-smtp.ap-northeast-1.amazonses.com` | 3600 | 10 |
   | TXT | `send.send` | `v=spf1 include:amazonses.com ~all` | 3600 | — |
   | TXT | `_dmarc` | `v=DMARC1; p=none;` | 3600 | — |

   - Use Resend's copy buttons. The DKIM key is long and the UI truncates it;
     a partial paste fails verification with no useful error.
   - Do not add quotes around TXT values — Hostinger adds them.
   - `send.send` is not a typo. It is the bounce subdomain of `send.vsource.dev`.
   - `_dmarc` sits on the root and therefore covers Microsoft 365 too. `p=none`
     is monitor-only and changes nothing about delivery.

3. Verify in Resend, then set:

   ```
   CONTACT_FROM_EMAIL=V Source <noreply@send.vsource.dev>
   CONTACT_TO_EMAIL=craig@vsource.dev
   ```

   No mailbox is needed for `noreply@` — nothing is ever delivered to it. The
   route sets `reply_to` to the enquirer, so replying in your inbox goes to them.

### Testing without a domain

Resend's test sender needs no DNS:

```
CONTACT_FROM_EMAIL=V Source <onboarding@resend.dev>
```

It only delivers to the address on the Resend account, so point
`CONTACT_TO_EMAIL` at that same address while testing.

## 9. Before launch — outstanding

- [ ] Neon production branch, production Blob store, and every Production
      variable (§3), with **Preview on the preview branch**.
- [ ] Production migrated and seeded **before** the first production build (§4).
- [ ] Accounts created with `pnpm user`, and real portraits uploaded.
- [ ] Preview media moved into the preview Blob store (§5), or preview images
      stay broken.
- [ ] Resend domain created and verified (§8). Until then the form cannot send
      to a real address.
- [ ] `CONTACT_TO_EMAIL` set to `craig@vsource.dev`.
- [ ] Turnstile widget renders on `/contact` in production.
- [ ] **LinkedIn URL**: `constants/contact.ts` carries a placeholder, which is
      also `sameAs` in the structured data.
- [ ] Turnstile keys live in Simon's personal Cloudflare account. Recreate them
      under a V Source account.
- [ ] Apex and `www` pointed at Vercel (§7).
