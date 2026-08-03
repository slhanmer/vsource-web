# Deploying vsource-web

Everything needed to take this site from the repo to production. Written for
whoever does the deploy, which may not be whoever built it.

---

## 1. Environment variables

Copy `.env.example` to `.env.local` (local) or set these in Coolify (production).
There are only three, all for the contact form.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | API key from resend.com |
| `CONTACT_TO_EMAIL` | Where enquiries land |
| `CONTACT_FROM_EMAIL` | Sender. Must be on a domain verified in Resend |

If any are missing the contact form still renders and validates, but returns
"The form is not configured yet. Please email us directly." rather than failing
silently. Nothing else on the site depends on environment configuration.

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
docker build --build-arg APP_ENV=prod -t vsource-web .
docker run -p 3000:3000 --env-file .env.local vsource-web
```

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

- [ ] Resend domain created and verified (section 2)
- [ ] `Engineering` service copy — still a placeholder, visibly marked on /services
- [ ] Home page hero copy — still placeholder wording
- [ ] Clear every remaining placeholder: `grep -rn "placeholder-copy" src`
- [ ] Favicon, apple-touch-icon and OG image — none exist yet
- [ ] `sitemap.xml` and `robots.txt` — not created
- [ ] Logo: currently a 1500x500 PNG with a CSS `brightness()` filter faking a
      light-on-dark variant. Wants proper SVG variants from Figma, plus a
      mark-only V for the favicon
- [ ] Confirm footer contact details and ABN against something authoritative
