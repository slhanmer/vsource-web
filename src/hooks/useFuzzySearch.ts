import { useMemo, useState } from 'react'
import Fuse, { IFuseOptions } from 'fuse.js'

/**
 * Provides client-side fuzzy search over an array of items using Fuse.js.
 * Returns the full `items` array when the search string is empty.
 * The Fuse index is memoised and only rebuilt when `items` or `keys` change.
 *
 * @param items - The array of objects to search
 * @param keys - Fuse.js key paths to index (e.g. `['name', 'email']`)
 * @param threshold - Match sensitivity 0–1; lower = stricter (default: 0.4)
 * @returns `{ search, setSearch, results }` — bind `setSearch` to an input and
 *   render `results` in place of `items`.
 *
 * @example
 * const { search, setSearch, results } = useFuzzySearch(users, ['firstName', 'email'])
 * <SearchInput value={search} onChange={e => setSearch(e.target.value)} />
 * {results.map(u => <UserRow key={u.id} user={u} />)}
 */
export function useFuzzySearch<T>(items: T[], keys: IFuseOptions<T>['keys'], threshold = 0.4) {
  const [search, setSearch] = useState('')

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys,
        threshold,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [items, keys, threshold]
  )

  const results = useMemo(() => {
    if (!search) return items
    return fuse.search(search).map((r) => r.item)
  }, [search, items, fuse])

  return { search, setSearch, results }
}
