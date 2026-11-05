# final-pass — log

## Simon: run this

Images on the preview are broken until you do this. Every media file is
still only in `public/media/` on this laptop.

1. **Get the preview Blob store's token:** Vercel → the project → **Storage**
   → the **preview** Blob store → the **`.env.local`** tab → copy
   `BLOB_READ_WRITE_TOKEN`. (`vercel env pull` gives `[encrypted]`, not the
   value.)
2. **From this repo**, with the token in the shell for that command only.
   `DATABASE_URL` comes from `.env.local`, the preview branch:

   ```bash
   BLOB_READ_WRITE_TOKEN="<preview store token>" pnpm media:blob        # dry run: lists 85 files
   BLOB_READ_WRITE_TOKEN="<preview store token>" pnpm media:blob --run  # uploads them
   ```

   The command in the brief, without `--run`, is the **dry run**: the
   starter's script only uploads with `--run`, and I kept that. Expect 29
   media rows and 85 files (originals plus the `thumb`, `card` and `wide`
   sizes), about 10.5 MB, with **0 missing** (I checked every file against
   `public/media/`). It is safe to rerun: a second run uploads nothing.
   Don't put the token in `.env.local`.
3. **Redeploy the preview**, then work through the checklist at the end of
   this log.

Also yours: the trailing-comma fix in `next.config.ts` is in your working
tree, uncommitted. I left it alone. `pnpm lint` passes with it, and Vercel's
build does not lint.

---

## 1. hero-stage-2: done

See `hero-stage-2.log.md`. Commits `3f586e6` (§4, the stream-page project
cards) and `5a9c61d` (§1–3: the stage at 1.4× the copy, faded on three
sides; more air in the copy; mobile type).

## 2. "Why we work this way": the working shot

- `media-inbox/photos/at-the-desk.jpg` (1200×1800) went in through the seed
  as `photos/at-the-desk`, with the brief's alt text. `site.workingPhoto`
  now points to it. The seed reported `1 created, 1 updated`, and a second
  run `0 created, 0 updated, 0 removed, 46 unchanged`.
  - `at-the-desk.jpg` was in `retired.media`, from hero-rebuild. **I removed
    it from that list**; otherwise the next seed run would have deleted the
    new photo.
- **Blurred the monitors.** At this size a 2× screen fetches the photo at
  almost its native width (544 CSS px; the source is 1200 wide). At that
  width the code was partly legible: `export async function
  syncHolderDeviceModes(tenantId, userId)` on the left screen, and an
  `aptium-pc` docker stack in the right-hand terminal. Aptium is under NDA.
  - A Gaussian blur (radius 5) covers both screens. Pixels that read as skin
    are masked out, so Craig's hands stay sharp, and the mask edge is
    feathered.
  - The blurred file is committed at `src/seed/assets/photos/at-the-desk.jpg`.
    The inbox file is the unblurred original.
- The group shot stays on `/team` only (`team-group-1.jpg`).
  `site.groupPhoto` is unchanged.
- ⚠ **For Simon:** `pointing.jpg` (the Software "What changes" row) and
  `hero-software.jpg` (the fold) come from the same session. They show the
  same editor, with `.claude` and `.github` folders, `devicePresenceService`
  and a few lines of the same code. At their sizes most of it is soft or out
  of focus, but it is the same kind of content I blurred here. I have not
  touched them, because the brief did not ask.
- axe (wcag2a/aa/21aa/22aa), every sitemap route plus the 404, light and
  dark: 30 runs, 0 violations.

Screenshots: `C:\tmp\final-pass\why-*.png`.

## 3. Clear the inbox

- **Deleting was refused** (the auto-mode permission check blocked
  `rm -rf`), so, as the brief says, everything went to
  **`_to_delete/media-inbox/`**:
  - `contact/`: Claude's 17 contact sheets.
  - `update/`: `aptium-logo.png`, `nug.jpg`, `nug-row.jpg` and
    `venues-montage.jpg`. I checked each one with `cmp`: it is byte-identical
    to its seed asset.
  - `photos/`: `at-the-desk.jpg`. This is the **unblurred** original. The
    blurred copy is the seed asset.
  - `hero/`, `built/`, `websites/`: already empty.
- **Kept in `media-inbox/robotics/`, because nothing references them:**
  - `huntsman-sim-rubble.mp4` and `huntsman-sim-rubble-poster.jpg`
  - `huntsman-sim-steps.mp4` and `huntsman-sim-steps-poster.jpg`

  `robotics-content.log.md` already lists them as unused.
- `media-inbox/` and `_to_delete/` are untracked, so this step changes no
  tracked files. This log entry is its commit.

## 4. Preview readiness

### 4a. Media in Blob (`e4e535c`)

- **`pnpm media:blob`** is the starter's script, adapted only as far as this
  repo needs:
  - `scripts/media-to-blob.mjs` is the wrapper. It sets `NODE_ENV=production`
    so nothing can push schema, and passes `--run` through as
    `MEDIA_BLOB_RUN`.
  - `src/db/media-blob.ts` is the runner. It loads the config through
    `./load-config` instead of `@payload-config` (the CommonJS/swc problem in
    `cms.log.md`), and lives in `src/db`, which is already an ESM folder.
  - `src/db/blob-plan.ts` is the starter's pure planner, unchanged.
  - Its tests moved from vitest to jest: `src/db/tests/blob-plan.test.ts`,
    6 tests.
- **Idempotent:** a file the store already holds at the same size is
  skipped. It writes nothing to the database, and rows already in Blob are
  untouched.
- I did **not** run it against any store. With no token it stops with
  "BLOB_READ_WRITE_TOKEN is not set" and exits 1.
- `.env.local` has no Blob token, so local dev keeps writing to
  `public/media/`.
- **Pre-flight**, through the local REST API: 29 media rows naming 85 files,
  all present in `public/media/`.
- `docs/media-blob.md` is new, written for this repo.
- `docs/DEPLOYMENT.md` §5 now names the command, explains how to get the
  token, and points to `docs/media-blob.md`.

### 4b. Build and push

- `pnpm tsc --noEmit`: clean.
- `pnpm lint`: clean, with Simon's uncommitted comma fix (see the top).
- `pnpm test:ci`: 48 suites, 641 tests passed.
- `pnpm build`: ok.
- **`pnpm build:deploy`** against the preview `DATABASE_URL`, passed into the
  environment for that one command (the script does not read `.env.local`
  itself): `deploy migrate: up to date — 9 migrations recorded`, then the
  build. Nothing to migrate: hero-stage's migration was already applied to
  the preview branch when it ran.
- Pushed `development`. Vercel builds the preview from it.

## 5. Preview checklist (Simon)

1. Run the `media:blob` commands above, then **redeploy** the preview.
2. **Every page, no broken images:** `/`, `/software`, `/robotics`,
   `/websites`, `/built`, every project (`/built/project-arachnid`,
   `/built/aptium-portal`, `/built/training-professionals`, `/built/sauce`,
   `/built/brisbane-venues`), `/team`, `/contact`, `/regulated`,
   `/accessibility`.
3. **`/admin`: sign in.** If the preview database has no account yet, create
   one first, **before** anyone opens `/admin`, because an empty users table
   lets anyone create the first account:
   `pnpm user <email> admin --generate` (it uses `.env.local`, the preview
   branch, and prints the password once).
4. **`/contact`:** the Turnstile widget renders. The preview's hostname must
   be allowed in Cloudflare Turnstile's site settings: `*.vercel.app`, or
   the preview URL. Then send a test enquiry and check that it arrives.
5. Share the preview URL with Craig.

STATUS: done
