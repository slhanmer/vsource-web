# Deploying vsource-web

Everything needed to take this site from the repo to production. Written for
whoever does the deploy, which may not be whoever built it.

---

## 1. Environment variables

Copy `.env.example` to `.env.local` (local) or set these in Coolify (production).
All of them are for the contact form.

**Runtime only** — read per request, Coolify's normal environment is enough:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | API key from resend.com |
| `CONTACT_TO_EMAIL` | Where enquiries land |
| `CONTACT_FROM_EMAIL` | Sender. Must be on a domain verified in Resend |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret. Optional |

**Build time** — must be a *build* variable in Coolify, not a runtime one:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile sitekey. Optional |

`NEXT_PUBLIC_*` is inlined into the bundle by `next build`, not read at runtime.
Set it only in the runtime environment and it compiles as `undefined`: the
widget never renders, the form still submits, and there is no error anywhere —
just no bot protection. The Dockerfile declares the matching `ARG`; Coolify has
to be told to pass it at build.

Both Turnstile variables are optional and independent of each other. With
neither set, the widget is not rendered and the route skips verification — the
honeypot, the timing check and the rate limit still apply, so the form is safe
to ship without them.

If the three Resend variables are missing the contact form still renders and
validates, but returns "The form is not configured yet. Please email us
directly." rather than failing silently.

---

## 2. Resend sending domain — DO THIS BEFORE LAUNCH

**Status: not done.** The domain was set up once and removed again while the
site was in development; it needs recreating at deploy time. Until it exists,
the contact form cannot send to a real address.

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
2. Resend issues four records. DNS for `vsource.dev` is at **Hostinger**
   (nameservers `ns1/ns2.dns-parking.com`), so add them in hPanel's DNS zone
   editor. Names are relative to the zone — enter them exactly as Resend shows:

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

---

## 3. Build and run

Standard Next.js standalone build. The Dockerfile is inherited from the Aptium
portal and unchanged.

```bash
pnpm install --frozen-lockfile
pnpm build          # next build --webpack
pnpm start          # serves .next/standalone
```

**Keep `--webpack`.** `next.config.ts` uses a custom webpack hook for
`@svgr/webpack` and to inject `_tokens.scss` into every SCSS file. Turbopack —
the Next 16 default — skips both and the site renders unstyled.

Docker:

```bash
docker build \
  --build-arg APP_ENV=prod \
  --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAA... \
  -t vsource-web .
docker run -p 3000:3000 --env-file .env.local vsource-web
```

**The build machine needs outbound access to `fonts.googleapis.com`.** `next/font`
downloads Chakra Petch and IBM Plex at build time and self-hosts them in the
bundle. There is no runtime dependency on Google — that is the point of doing it
this way — but a build box without egress will fail.

---

## 4. DNS cutover

The current site (the old Virologyst page) is on Hostinger shared hosting:

```
A  vsource.dev  ->  31.220.110.14
```

Point that at the new host when ready. Same Hostinger DNS zone. Lower the TTL a
day beforehand if you want a fast rollback.

---

## 5. Before launch — outstanding

Blocking:

- [ ] **Resend domain created and verified** (section 2). Until then the form
      cannot send to a real address.
- [ ] **`CONTACT_TO_EMAIL`** — set to `craig@vsource.dev`. It was `simon@` during
      development.
- [ ] **DNS cutover** (section 4), and 301s for anything the current Virologyst
      site has indexed, or those URLs 404.

Needs Craig specifically:

- [ ] **LinkedIn URL** — `constants/contact.ts` carries a placeholder
      (`linkedin.com/company/vsource-development`). It is also used as `sameAs`
      in the site's structured data, so it is a dead link in the schema until it
      is real.
- [ ] **`Taking work`** — the status line in `constants/status.ts` was invented
      during the build. Confirm it says what you want it to say.
- [ ] **Turnstile keys** currently live in Simon's personal Cloudflare account.
      Recreate the widget under a V Source account so they can be rotated
      without going through him.

Not blocking:

- [ ] Logo is a 600x200 WebP with a CSS `brightness()` filter faking a
      light-on-dark variant. Wants proper SVG variants from Figma, plus a
      mark-only V lockup for narrow screens.
- [ ] Crew portraits — initials are used until they exist.
- [ ] Never keyboard-tested or opened on a physical phone. The build is to
      WCAG 2.2 AA and the audit was done on measurements, but a tab-through and
      a real device check have not happened.

Done since this document was first written: OG image, `robots.txt`, `sitemap.xml`,
canonicals, JSON-LD, favicon and apple-touch-icon, all placeholder copy.
