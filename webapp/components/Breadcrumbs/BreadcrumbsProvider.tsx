'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// The kinds of entity whose names appear in paths, e.g. `/notes/<id>`. Extend it as routes are added.
export type BreadcrumbEntity = 'note'

type BreadcrumbsContext = {
  /** Human friendly names of the entities appearing in the path, e.g. `note:<id>` -> `Groceries`. */
  labels: Record<string, string>
  /** Last query string seen on each path, e.g. `/notes` -> `search=milk&page=2`. */
  queries: Record<string, string>
  setLabel: (entity: BreadcrumbEntity, id: string, label: string) => void
  setQuery: (path: string, query: string) => void
}

const Context = createContext<BreadcrumbsContext>({
  labels: {},
  queries: {},
  setLabel: () => {},
  setQuery: () => {},
})

export function labelKey(entity: BreadcrumbEntity, id: string) {
  return `${entity}:${id}`
}

/**
 * Keeps the breadcrumbs state for the whole authenticated area. It is mounted in
 * the `(authenticated)` layout, which App Router preserves across client side
 * navigations, so names and searches survive moving between pages without
 * asking the API again. It is kept in memory only (no browser storage), as it
 * may hold personal data.
 */
export default function BreadcrumbsProvider({ children }: { children: React.ReactNode }) {
  const [ labels, setLabels ] = useState<Record<string, string>>({})
  const [ queries, setQueries ] = useState<Record<string, string>>({})

  const setLabel = useCallback((entity: BreadcrumbEntity, id: string, label: string) => {
    const key = labelKey(entity, id)
    setLabels(current => current[key] === label ? current : { ...current, [key]: label })
  }, [])

  const setQuery = useCallback((path: string, query: string) => {
    setQueries(current => current[path] === query ? current : { ...current, [path]: query })
  }, [])

  const value = useMemo(() => ({ labels, queries, setLabel, setQuery }), [ labels, queries, setLabel, setQuery ])

  return (
    <Context.Provider value={ value }>
      <Suspense fallback={ null }>
        <QueryTracker />
      </Suspense>
      { children }
    </Context.Provider>
  )
}

export function useBreadcrumbs() {
  return useContext(Context)
}

/**
 * Remembers the query string (search, pagination...) of every visited path, so
 * the breadcrumbs pointing back to it restore the same search.
 */
function QueryTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setQuery } = useBreadcrumbs()

  useEffect(() => {
    setQuery(pathname, searchParams.toString())
  }, [ pathname, searchParams, setQuery ])

  return null
}
