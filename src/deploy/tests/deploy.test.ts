import { readFileSync } from 'node:fs'
import path from 'node:path'

import {
  dbChangeBanner,
  deployEnvProblem,
  migrationNames,
  newMigrations,
} from '../../../scripts/lib/deploy.mjs'

/*
 * Ported from the starter's src/deploy/deploy.test.ts (vitest) to jest. The
 * release-manifest tests are not ported: this repo has no
 * .release-manifest.txt, because it is not a template other sites take
 * releases from.
 */

/* jest runs from the repo root. */
const root = process.cwd()
const read = (rel: string) => readFileSync(path.join(root, rel), 'utf8')

describe('the Vercel build command', () => {
  /*
   * The whole guarantee rests on Vercel running build:deploy and not plain
   * `next build`. If either end of that link moves, a deploy builds without
   * migrating and 500s on a schema change instead of failing.
   */
  it('is pnpm build:deploy', () => {
    expect(JSON.parse(read('vercel.json')).buildCommand).toBe('pnpm build:deploy')
  })

  it('build:deploy runs the deploy build script', () => {
    expect(JSON.parse(read('package.json')).scripts['build:deploy']).toBe(
      'node scripts/deploy-build.mjs'
    )
  })

  it('migrates before it builds', () => {
    const source = read('scripts/deploy-build.mjs')
    const migrate = source.indexOf("step('migrate'")
    const build = source.indexOf("step('build'")
    expect(migrate).toBeGreaterThan(-1)
    expect(build).toBeGreaterThan(migrate)
  })
})

describe('deployEnvProblem', () => {
  const url = 'postgresql://u:p@ep-x.ap-southeast-2.aws.neon.tech/neondb'

  it('allows a real connection string', () => {
    expect(deployEnvProblem({ DATABASE_URL: url })).toBeNull()
  })

  it('refuses a missing DATABASE_URL', () => {
    expect(deployEnvProblem({})).toMatch(/not set/)
  })

  it("refuses vercel env pull's placeholder", () => {
    expect(deployEnvProblem({ DATABASE_URL: '[encrypted]' })).toMatch(/not a postgres/)
  })

  it('refuses dev push', () => {
    expect(deployEnvProblem({ DATABASE_URL: url, PAYLOAD_PUSH: '1' })).toMatch(/PAYLOAD_PUSH/)
  })
})

describe('migrationNames', () => {
  it('takes the .ts files, not index.ts or the .json snapshots', () => {
    expect(
      migrationNames([
        'src/migrations/20261011_031747_contact_ask.json',
        'src/migrations/20261011_031747_contact_ask.ts',
        'src/migrations/20261010_094550_initial.ts',
        'src/migrations/index.ts',
        'src/blocks/core.ts',
        '',
      ])
    ).toEqual(['20261010_094550_initial', '20261011_031747_contact_ask'])
  })

  it('reads Windows separators', () => {
    expect(migrationNames(['src\\migrations\\20261010_094550_initial.ts'])).toEqual([
      '20261010_094550_initial',
    ])
  })
})

describe('newMigrations', () => {
  it('is what the checkout has and release does not', () => {
    expect(newMigrations(['a', 'b', 'c'], ['a', 'b'])).toEqual(['c'])
  })

  it('is nothing when release already has them all', () => {
    expect(newMigrations(['a', 'b'], ['a', 'b'])).toEqual([])
  })
})

describe('dbChangeBanner', () => {
  it('is silent when there is no schema change', () => {
    expect(dbChangeBanner([])).toBe('')
  })

  it('says DB CHANGE and names every new migration', () => {
    const banner = dbChangeBanner(['20261020_100000_bookings', '20261021_100000_hours'])
    expect(banner).toContain('DB CHANGE')
    expect(banner).toContain('2 migrations')
    expect(banner).toContain('20261020_100000_bookings')
    expect(banner).toContain('20261021_100000_hours')
  })

  it('counts one in the singular', () => {
    expect(dbChangeBanner(['x'])).toContain('adds 1 migration\n')
  })
})
