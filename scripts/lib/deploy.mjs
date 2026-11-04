/*
 * Pure helpers for the deploy build and for `pnpm release`. No I/O here, so
 * src/deploy/tests/deploy.test.ts covers them without a database or a git repo.
 * (The release helpers below are the starter's; this repo has no `pnpm release`
 * yet, but they are kept so the file stays a straight copy.)
 */

/**
 * Why a deploy build must not touch its database, or null if it may.
 * @param {Record<string, string | undefined>} env
 * @returns {string | null}
 */
export function deployEnvProblem(env) {
  const url = env.DATABASE_URL ?? ''
  if (!url) {
    return 'DATABASE_URL is not set for this deployment, so there is nothing to migrate against. Set it in the Vercel project for this environment.'
  }
  /*
   * `vercel env pull` writes "[encrypted]" for a secret, and that string has
   * reached .env files before. It is not a database.
   */
  if (!/^postgres(ql)?:\/\//.test(url)) {
    return `DATABASE_URL is not a postgres connection string (starts "${url.slice(0, 12)}…").`
  }
  if (env.PAYLOAD_PUSH === '1') {
    return 'PAYLOAD_PUSH=1 is set. Dev push rewrites a schema to match the config and is for a throwaway database only — never a deployment. Unset it.'
  }
  return null
}

/**
 * Migration names from repo paths: `src/migrations/<name>.ts`, minus index.ts.
 * The .json beside each is drizzle's snapshot, not a second migration.
 * @param {string[]} paths
 * @returns {string[]}
 */
export function migrationNames(paths) {
  const names = new Set()
  for (const p of paths) {
    const m = /^src\/migrations\/([^/]+)\.ts$/.exec(p.replace(/\\/g, '/'))
    if (m && m[1] !== 'index') names.add(m[1])
  }
  return [...names].sort()
}

/**
 * In this checkout and not on the release branch: what the next release adds.
 * @param {string[]} current
 * @param {string[]} released
 * @returns {string[]}
 */
export function newMigrations(current, released) {
  const had = new Set(released)
  return current.filter((name) => !had.has(name))
}

/**
 * The banner `pnpm release` prints when the release changes the schema.
 * Empty string when it does not.
 * @param {string[]} added
 * @returns {string}
 */
export function dbChangeBanner(added) {
  if (added.length === 0) return ''
  const bar = '#'.repeat(72)
  const n = `${added.length} migration${added.length === 1 ? '' : 's'}`
  return [
    bar,
    `#  DB CHANGE — this release adds ${n}`,
    bar,
    ...added.map((name) => `   + ${name}`),
    '',
    '   Every client database has to take these. In order:',
    '   1. Every database the release reaches is on migrations — `pnpm db:baseline`',
    '      exits 0 against it. A dev-pushed one fails the deploy build.',
    "   2. `pnpm sites --run` migrates each site's local and staging database.",
    '   3. Each Vercel deploy migrates its own database in `pnpm build:deploy`,',
    '      before `next build`. For a LIVE site that is its production database.',
    '   4. `pnpm smoke <url>` against every deployed site afterwards.',
    '   Tag MINOR at least. MAJOR if a migration drops, renames or retypes.',
    '   docs/release-checklist.md has the rest.',
    bar,
  ].join('\n')
}
