# Brief — final-pass (to preview)

**Goal: a working Vercel preview of `development` within two hours**
(Simon, 5 November, 16:00), ready to share with Craig. Work in this order and
commit after each step. If a step blocks, log it and **skip to the next step**
rather than stopping the run. Step 4 is the one that must land.
**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only.
**Read `CLAUDE.md` first.**

---

## 1. Run `hero-stage-2.md` in full

All four sections: the stage at about 1.4× the copy height with soft edges,
more air in the copy, the mobile type bump, and project cards on the stream
pages. Its own log, as usual.

## 2. "Why we work this way": the working shot, not the group shot

Simon (5 November): the section is about *how* the team works, so a posed
group photo is the wrong picture, and `/team` already uses it.

- Upload `media-inbox/photos/at-the-desk.jpg` (1200×1800, Simon and Craig at
  the desk) through the seed (upsert by filename; mind the `-1` suffix fix
  from `review-2`), and set `site.workingPhoto` to it.
  Alt: `Craig talks through code on a monitor while Simon types at the keyboard.`
- The group shot stays on `/team` only.
- At this section's size the code on screen must be unreadable. If it is
  legible at 2× DPR, add a light blur to the monitor area, regenerate, and log
  it.

## 3. Clear the inbox

Everything in `media-inbox/` that is now in `media` can go (`update/`,
`photos/`, `hero/`, `robotics/`, `built/`, `websites/`). Keep only files
nothing references, and list them. `media-inbox/contact/` is Claude's contact
sheets: delete it. If deletes are refused, move it all under
`_to_delete/media-inbox/` and say so.

## 4. Preview readiness (must land)

The preview deployment uses the **preview Neon branch**, the same database
local dev uses, so the content is already there. Two things stand between
that and a working preview.

### 4a. Media in Blob

Per `docs/DEPLOYMENT.md` §5, every media row was created locally without a
Blob token, so its file is in `public/media/` (gitignored) and **not** in the
preview Blob store. On a preview deployment every image would be broken.

- Copy the starter's `scripts/media-to-blob.mjs` and `docs/media-blob.md`
  (read only from `C:\Users\SLHan\Desktop\Dev\starter`), adapted only as far
  as this repo needs (the CommonJS/swc notes from `cms.log.md` apply). Add a
  `media:blob` script. It must be idempotent and must not touch rows whose
  file is already in Blob.
- **Do not run it against the preview store yourself.** Simon will, with the
  preview store's token in the shell for that one command:
  ```bash
  BLOB_READ_WRITE_TOKEN="<preview store token>" pnpm media:blob
  ```
  Write that command, and how to find the token (Vercel → Storage → the
  preview store → `.env.local` tab), at the top of your log under
  **"Simon: run this"**.
- Update `docs/DEPLOYMENT.md` §5, which currently says the script is not in
  this repo yet.

### 4b. Build and push

- Full gate: `pnpm tsc --noEmit`, `pnpm lint`, `pnpm test:ci`, `pnpm build`.
- Run `pnpm build:deploy` locally once against the preview `DATABASE_URL`
  from `.env.local`. It must report nothing to migrate, or apply only this
  run's migrations, and then build.
- Push `development`. Vercel builds a preview from it automatically.

## 5. Preview checklist (for Simon, in the log)

End the log with a short checklist Simon runs on the preview URL:

1. Run the `media:blob` command (4a), then redeploy the preview.
2. Every page: no broken images (`/`, the three streams, `/built` and every
   project, `/team`, `/contact`, `/regulated`, `/accessibility`).
3. `/admin`: sign in. If no account exists on the preview DB, create one first
   with `pnpm user <email> admin --generate`, because an empty users table lets
   anyone create the first account.
4. `/contact`: the Turnstile widget renders. The preview's hostname must be
   allowed in the Cloudflare Turnstile site settings (`*.vercel.app`, or the
   preview URL). Then send a test enquiry.
5. Share the preview URL with Craig.

---

## Verify

Each step's checks are in its own section. Overall, axe on every sitemap
route plus the 404, light and dark: 0 violations, run after step 2.

## The log

Append to `docs/briefs/final-pass.log.md`, with **"Simon: run this"** at the
top. Last line exactly one of `STATUS: done`, `STATUS: partial`,
`STATUS: blocked`.
