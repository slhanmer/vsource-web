/*
 * Copied from the starter's src/seed/guard.ts. Only this line and the path
 * below differ.
 *
 * THE SEED STOPS BEING DANGEROUS.
 *
 * Once anyone has edited a site in the admin, the database is the source of
 * truth and src/seed/content.ts is history. A seed run after that would put
 * the history back over the edit. So the seed refuses to overwrite a row that
 * has changed since it last wrote it, says which, and goes on only with
 * --force.
 *
 * HOW "EDITED" IS DETECTED, AND WHY THIS WAY.
 *
 * At the end of every run the seed records, in Payload's key-value store (the
 * payload_kv table, so the record lives in the same database it describes and
 * travels with it to staging), every row it wrote: its `updatedAt`, and for
 * collections with drafts, how many versions it has. Before the next run
 * writes anything, every row it is about to overwrite is checked against that
 * record:
 *
 *   - `updatedAt` moved           → somebody saved it.
 *   - more versions than recorded → somebody saved a DRAFT. A draft does not
 *                                   touch the published row's updatedAt, and
 *                                   the seed publishing over it would bury it.
 *   - not in the record at all    → a row the last seed did not write, with
 *                                   the same slug or alt — somebody made it.
 *
 * Not a timestamp comparison against "when the seed ran": that compares the
 * seeding laptop's clock with Vercel's, and a laptop running a few seconds
 * fast hides an edit made just after a seed. Equality of the row's own value
 * has no clock in it.
 *
 * A row the seed would CREATE is never a conflict — nothing is overwritten —
 * so an empty database always seeds.
 *
 * A database seeded before the record existed has nothing to compare against.
 * It is treated as unedited only if it has no user accounts at all, because an
 * admin edit needs a login. With accounts it cannot know, so it refuses.
 */

export type SeedRecord = {
  version: 1
  slug: string
  at: string
  /** collection → id → the row's updatedAt and, if versioned, its version count. */
  docs: Record<string, Record<string, { updatedAt: string; versions?: number }>>
}

export type Existing = {
  collection: string
  id: string | number
  /** What a person would call it — a page slug, a menu slug, an image's alt. */
  label: string
  updatedAt: string
  versions?: number
}

export type Conflict = Existing & {
  reason: 'edited' | 'draft saved' | 'not written by the last seed' | 'unknown, no seed record'
}

export function seedKey(site: string): string {
  return `seed:${site}`
}

export function conflicts(args: {
  record: SeedRecord | null
  existing: Existing[]
  hasUsers: boolean
}): Conflict[] {
  const { record, existing, hasUsers } = args

  if (!record) {
    return hasUsers
      ? existing.map((row) => ({ ...row, reason: 'unknown, no seed record' as const }))
      : []
  }

  const out: Conflict[] = []
  for (const row of existing) {
    const seen = record.docs[row.collection]?.[String(row.id)]
    if (!seen) out.push({ ...row, reason: 'not written by the last seed' })
    else if (seen.updatedAt !== row.updatedAt) out.push({ ...row, reason: 'edited' })
    else if ((row.versions ?? 0) > (seen.versions ?? 0)) out.push({ ...row, reason: 'draft saved' })
  }
  return out
}

export function describe(found: Conflict[]): string {
  return found
    .map((c) => `  ${c.collection.padEnd(8)} ${c.label}  (${c.reason}; id ${c.id})`)
    .join('\n')
}
