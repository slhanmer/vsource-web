import { pathToFileURL } from 'node:url'
import { findConfig } from 'payload/node'
import type { SanitizedConfig } from 'payload'

/*
 * How a CLI script (`pnpm payload run …`) gets the Payload config in this repo.
 *
 * The starter's scripts write `import config from '@payload-config'`. Here that
 * fails with ERR_REQUIRE_CYCLE_MODULE: Payload's CLI has already loaded
 * payload.config.ts by URL, as ESM, and the alias import resolves the same file
 * through the swc loader, which marks a repo-root .ts file CommonJS because
 * this repo is not "type": "module". Same file, two formats, and Node refuses.
 *
 * So scripts load it exactly the way the CLI does — `import()` of the file URL
 * findConfig() returns — and get the module the CLI already has.
 *
 * Next never uses this: the site and /admin import `@payload-config` directly.
 */
export async function loadConfig(): Promise<SanitizedConfig> {
  const mod = await import(pathToFileURL(findConfig()).href)
  return mod.default
}
