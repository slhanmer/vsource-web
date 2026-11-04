#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { deployEnvProblem } from './lib/deploy.mjs'

/*
 * pnpm build:deploy — what Vercel runs instead of `pnpm build` (vercel.json).
 *
 * WHY. A schema change used to reach a deployment's database only if somebody
 * remembered to run `payload migrate` against it first. When nobody did, the
 * build passed and the site 500ed on its first request. Now the deploy migrates
 * its own database — whatever DATABASE_URL that Vercel environment holds — and
 * a migration that fails fails the build, so the old deployment stays up.
 *
 *   1. refuse without a real DATABASE_URL, or with PAYLOAD_PUSH=1
 *   2. migrate (src/db/deploy-migrate.ts), refusing a dev-pushed database
 *   3. `pnpm build`
 *
 * ⚠️ IT MIGRATES WHATEVER THE ENVIRONMENT POINTS AT. Preview deployments of a
 * live site must never read the live database — if they did, an unmerged
 * branch would migrate it. See docs/migrations.md.
 *
 * Locally and in CI, `pnpm build` is unchanged and touches no database.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function step(label, args, env) {
  console.log(`\n▶ ${label}`)
  const r = spawnSync('pnpm', args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    // Windows resolves pnpm through a shim, which needs a shell.
    shell: process.platform === 'win32',
  })
  if (r.status !== 0) {
    console.error(
      `\nbuild:deploy: ${label} failed (exit ${r.status ?? r.signal}). Nothing was built.`
    )
    process.exit(r.status || 1)
  }
}

const problem = deployEnvProblem(process.env)
if (problem) {
  console.error(`build:deploy: ${problem}`)
  process.exit(1)
}

/* NODE_ENV=production so connecting cannot dev-push, as db:baseline does. */
step('migrate', ['payload', 'run', './src/db/deploy-migrate.ts'], { NODE_ENV: 'production' })
step('build', ['build'])
