import { getPayload, type Migration } from 'payload'

import { loadConfig } from './load-config'
import { migrations } from './migrations'
import { planDeploy, type RecordedMigration, stillPending } from './deploy-plan'

/*
 * The migrate half of `pnpm build:deploy` — run by scripts/deploy-build.mjs
 * against the deployment's own DATABASE_URL, before `next build`.
 *
 * Exit 0 only when every migration in src/migrations is recorded in this
 * database afterwards. Anything else is exit 1, and the Vercel build fails
 * before a single page is built: a deploy that cannot migrate must not ship
 * code that expects the migration.
 *
 * The decision is in ./deploy-plan.ts; this file is only the database calls.
 */

async function main() {
  // Not `import config from '@payload-config'`: see ./load-config.ts.
  const payload = await getPayload({ config: await loadConfig() })
  // The postgres adapter; Payload types it as the generic adapter.
  const db = payload.db as unknown as {
    drizzle: unknown
    schemaName?: string
    execute: (args: {
      drizzle: unknown
      raw: string
    }) => Promise<{ rows: Record<string, unknown>[] }>
  }

  const schema = db.schemaName ?? 'public'
  const table = `"${schema}"."payload_migrations"`
  const names = migrations.map((m) => m.name)

  const readRecorded = async (): Promise<RecordedMigration[] | null> => {
    const exists = await db.execute({
      drizzle: db.drizzle,
      raw: `SELECT to_regclass('${table.replace(/'/g, "''")}') AS t`,
    })
    if (!exists.rows[0]?.t) return null
    const { rows } = await db.execute({
      drizzle: db.drizzle,
      raw: `SELECT name, batch FROM ${table}`,
    })
    return rows.map((r) => ({ name: String(r.name), batch: Number(r.batch) }))
  }

  const plan = planDeploy({ migrations: names, recorded: await readRecorded() })

  if (plan.action === 'refuse-dev') {
    console.error('deploy migrate: REFUSED — this database was built by dev push.')
    console.error('')
    console.error('It still has the `dev` row in payload_migrations, and `payload migrate`')
    console.error('on it asks a question nobody is here to answer, then exits 0 having')
    console.error('migrated nothing. Put it onto migrations once, from a starter checkout:')
    console.error('')
    console.error('  DATABASE_URL="<this deployment\'s string>" pnpm db:baseline')
    console.error('  DATABASE_URL="<this deployment\'s string>" pnpm db:baseline --apply')
    console.error('')
    console.error('then redeploy. docs/migrations.md in starter has the detail.')
    process.exit(1)
  }

  for (const name of plan.unknown) {
    console.log(`deploy migrate: note — ${name} is recorded here but not in this code (newer)`)
  }

  if (plan.pending.length === 0) {
    console.log(`deploy migrate: up to date — ${names.length} migrations recorded`)
    process.exit(0)
  }

  console.log(`deploy migrate: running ${plan.pending.length}:`)
  for (const name of plan.pending) console.log(`  ${name}`)

  // Payload's own runner: one transaction per migration, process.exit(1) on error.
  // The generated files type their args precisely; Payload's signature says unknown.
  await payload.db.migrate({ migrations: migrations as unknown as Migration[] })

  /*
   * Checked, not assumed. Payload's migrate has a path that exits 0 without
   * running anything (the prompt above); if a future version grows another,
   * this is what stops the build.
   */
  const missing = stillPending(names, (await readRecorded()) ?? [])
  if (missing.length) {
    console.error(`deploy migrate: still not recorded after migrate: ${missing.join(', ')}`)
    process.exit(1)
  }
  console.log('deploy migrate: done')
  process.exit(0)
}

try {
  await main()
} catch (error) {
  console.error(`deploy migrate: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
