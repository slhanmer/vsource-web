/*
 * What a deploy build may do to the database it is about to serve. Pure, so it
 * is tested without one.
 *
 * WHY A PLAN AND NOT JUST `payload migrate`. Payload's migrate, on a database
 * that still carries the `dev` row (batch -1) dev push leaves behind, stops to
 * ask "would you like to proceed?" — and in a build, where nobody can answer,
 * the prompt resolves to no and it calls `process.exit(0)`. The build would go
 * green having migrated nothing, and the first request to the new code would
 * 500 on a missing column. So a dev-pushed database is refused here, loudly,
 * with the command that fixes it: `pnpm db:baseline`.
 */

export type RecordedMigration = { name: string; batch: number }

export type DeployPlan =
  | {
      action: 'migrate'
      /** In src/migrations and not yet recorded: what this build will run. */
      pending: string[]
      /**
       * Recorded but not in src/migrations — the database is ahead of this code,
       * usually because a newer deployment already migrated it. Not an error:
       * migrations here only ever add, so older code still runs on it.
       */
      unknown: string[]
    }
  | { action: 'refuse-dev' }

export function planDeploy(args: {
  migrations: string[]
  /** null when the database has no payload_migrations table at all. */
  recorded: RecordedMigration[] | null
}): DeployPlan {
  const { migrations, recorded } = args

  /*
   * No table: a new, empty database. `payload migrate` builds it from nothing,
   * which is how onboarding builds one anyway. A database with tables and no
   * migrations table fails on the first CREATE, which exits non-zero — good.
   */
  if (recorded === null) return { action: 'migrate', pending: [...migrations], unknown: [] }

  if (recorded.some((m) => m.batch === -1)) return { action: 'refuse-dev' }

  const names = new Set(recorded.map((m) => m.name))
  const known = new Set(migrations)
  return {
    action: 'migrate',
    pending: migrations.filter((name) => !names.has(name)),
    unknown: [...names].filter((name) => !known.has(name)).sort(),
  }
}

/** Every migration recorded after the run, or the ones that are not. */
export function stillPending(migrations: string[], recorded: RecordedMigration[]): string[] {
  const names = new Set(recorded.map((m) => m.name))
  return migrations.filter((name) => !names.has(name))
}
