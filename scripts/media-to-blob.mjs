#!/usr/bin/env node
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/*
 * pnpm media:blob [--run]
 *
 * Copied from the starter. Wrapper so the flag arrives as an env var, as
 * `pnpm seed` does. The work is in src/db/media-blob.ts; read its header, and
 * docs/media-blob.md, before running it.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const run = process.argv.includes('--run')

const child = spawn('pnpm', ['payload', 'run', './src/db/media-blob.ts'], {
  cwd: root,
  /*
   * ⚠️ NODE_ENV=production SO PAYLOAD DOES NOT PUSH SCHEMA. Outside production
   * the postgres adapter rewrites the database to match the config on connect,
   * and this runs against shared databases. A database without media.prefix
   * fails the query instead, which is the right answer: migrate it first.
   */
  env: { ...process.env, NODE_ENV: 'production', MEDIA_BLOB_RUN: run ? '1' : '0' },
  stdio: 'inherit',
  // Windows resolves pnpm through a shim, which needs a shell.
  shell: true,
})

child.on('exit', (code) => process.exit(code ?? 1))
