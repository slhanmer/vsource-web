#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'

/*
 * pnpm user <email> [admin|editor] [--generate] [--set-role]
 *
 * Creates an account on the database DATABASE_URL names. In this repo that is
 * the one in .env.local (the Neon preview branch); for production, pass the
 * production string explicitly:
 *
 *   DATABASE_URL="<site's database>" pnpm user owner@venue.com.au editor --generate
 *
 * The password is asked for here and passed to the child as an env var. It is
 * never an argument — arguments land in shell history and in `ps` — and it is
 * never written to a file. Echo is suppressed while it is typed.
 *
 * --generate   make a strong password instead of asking, and print it ONCE.
 *              Copy it into whatever you send the client; it is not stored.
 * --set-role   the account already exists: change its role to the one given,
 *              and nothing else. How a client who takes the site over becomes
 *              admin of it.
 */
const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith('--')))
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
/* Trimmed, because a stray space or quote off a shell survives all the way to
   Payload and comes back as "the following field is invalid". */
const email = (args[0] ?? '').trim().replace(/^['"]|['"]$/g, '')
const role = (args[1] ?? 'editor').trim()

if (!email || !email.includes('@')) {
  console.error('Usage: pnpm user <email> [admin|editor] [--generate] [--set-role]')
  console.error('  editor — changes copy, images and menus. What a client gets.')
  console.error('  admin  — also composes pages and manages accounts.')
  process.exit(1)
}
if (role !== 'admin' && role !== 'editor') {
  console.error(`Role must be "admin" or "editor". Got "${role}".`)
  process.exit(1)
}

function askHidden(question) {
  /*
   * The documented readline mute: override _writeToOutput on the interface.
   * An earlier version attached its own 'data' listener to process.stdin
   * alongside readline's, which on Windows is a good way to get input back
   * that is not what was typed.
   */
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    })
    let muted = false
    rl._writeToOutput = (chunk) => {
      if (!muted) rl.output.write(chunk)
    }
    rl.question(question, (answer) => {
      rl.close()
      process.stdout.write('\n')
      resolve(answer.trim())
    })
    muted = true
  })
}

/*
 * 18 random bytes as base64url: 24 characters, about 144 bits. Long enough
 * that nobody needs to be told to change it, and no characters that break when
 * pasted into an email or a password manager.
 */
const password = flags.has('--set-role')
  ? ''
  : flags.has('--generate')
    ? randomBytes(18).toString('base64url')
    : await askHidden(`Password for ${email}: `)
if (!flags.has('--set-role') && password.length < 8) {
  console.error('Payload requires at least 8 characters.')
  process.exit(1)
}

const child = spawn('pnpm', ['payload', 'run', './src/seed/user.ts'], {
  cwd: root,
  env: {
    ...process.env,
    NEW_USER_EMAIL: email,
    NEW_USER_PASSWORD: password,
    NEW_USER_ROLE: role,
    NEW_USER_SET_ROLE: flags.has('--set-role') ? '1' : '0',
    // No dev push against a client database; see payload.config.ts.
    NODE_ENV: 'production',
  },
  stdio: 'inherit',
  shell: true,
})
child.on('exit', (code) => {
  if (code === 0 && flags.has('--generate')) {
    console.log('')
    console.log(`  ${email}`)
    console.log(`  ${password}`)
    console.log('')
    console.log('  Shown once and not stored. Send it to them now.')
  }
  process.exit(code ?? 1)
})
