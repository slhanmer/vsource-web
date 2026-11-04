// `.js`: this file is also loaded as ESM by the Payload CLI, and Next has no
// exports map, so the bare specifier does not resolve there.
import { revalidateTag } from 'next/cache.js'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  GlobalAfterChangeHook,
  GlobalConfig,
} from 'payload'

/*
 * PUBLISHING CLEARS THE CACHE. Copied from the starter's src/lib/revalidate.ts;
 * the tag is ours (`content`) and there is a global variant, because this site
 * has a global (`site`) and the starter's pages do not.
 *
 * src/data/ caches every collection under the one tag `content`, and the
 * public pages are statically rendered from those getters. Without this, an
 * edit in the admin would not show until the next deploy, and would look like
 * it did not save. With it, the next request after a save is fresh.
 *
 * ⚠️ `{ expire: 0 }`, NOT THE 'max' PROFILE NEXT RECOMMENDS. 'max' marks the
 * entry stale and serves the stale copy to the next request while it refreshes
 * in the background — so the person who just pressed Save reloads and still
 * sees the old page. expire: 0 makes the next request wait for fresh data,
 * which on a site this size is one query.
 *
 * ⚠️ ATTACHED TO EVERY COLLECTION BUT `users`, AND TO THE GLOBAL, IN
 * payload.config.ts, NOT COLLECTION BY COLLECTION. A collection added later and
 * missed here is an edit that silently never appears. Over-invalidating costs
 * one query.
 *
 * Outside a Next request — `pnpm seed`, `payload run`, a migration — there is
 * no cache to clear and revalidateTag throws. That is expected and swallowed:
 * the deployed site's cache is not reachable from a laptop anyway. After a
 * seed against a deployed database, redeploy (see docs/DEPLOYMENT.md).
 */
export const CONTENT_CACHE_TAG = 'content'

export function clearContentCache(revalidate: typeof revalidateTag = revalidateTag): void {
  try {
    revalidate(CONTENT_CACHE_TAG, { expire: 0 })
  } catch {
    /* Not inside a Next request (seed, CLI, migration). See above. */
  }
}

const clear = () => clearContentCache()

const afterChange: CollectionAfterChangeHook = ({ doc }) => {
  clear()
  return doc
}

const afterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  clear()
  return doc
}

const globalAfterChange: GlobalAfterChangeHook = ({ doc }) => {
  clear()
  return doc
}

/** Collections whose changes cannot alter a rendered page. */
const NOT_RENDERED = new Set(['users'])

export function withContentRevalidation(collection: CollectionConfig): CollectionConfig {
  if (NOT_RENDERED.has(collection.slug)) return collection
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      afterChange: [...(collection.hooks?.afterChange ?? []), afterChange],
      afterDelete: [...(collection.hooks?.afterDelete ?? []), afterDelete],
    },
  }
}

export function withGlobalRevalidation(global: GlobalConfig): GlobalConfig {
  return {
    ...global,
    hooks: {
      ...global.hooks,
      afterChange: [...(global.hooks?.afterChange ?? []), globalAfterChange],
    },
  }
}
