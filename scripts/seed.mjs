#!/usr/bin/env node
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/*
 * pnpm seed [--force]
 *
 * Adapted from the starter's scripts/seed.mjs. There is one site here, so no
 * slug: it loads src/seed/content.ts into the database DATABASE_URL names (in
 * this repo, the Neon preview branch in .env.local). For production, pass the
 * production string explicitly — see docs/DEPLOYMENT.md.
 *
 * --force overwrites rows edited in the admin since the last seed. The seed
 * refuses without it and lists them; see src/seed/guard.ts.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const force = process.argv.includes('--force')

const child = spawn('pnpm', ['payload', 'run', './src/seed/run.ts'], {
  cwd: root,
  env: { ...process.env, SEED_FORCE: force ? '1' : '0' },
  stdio: 'inherit',
  // Windows resolves pnpm through a shim, which needs a shell.
  shell: true,
})

child.on('exit', (code) => process.exit(code ?? 1))
