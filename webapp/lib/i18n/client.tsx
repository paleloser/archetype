'use client'

import { createContext, useContext } from 'react'

import { defaultLocale, Locale, localeCookieMaxAge, localeCookieName } from './config'
import type { Dictionary } from './dictionary'

const LocaleContext = createContext<Locale>(defaultLocale)

/** Makes the locale resolved on the server available to client components. */
export function LocaleProvider({ locale, children }: { locale: Locale, children: React.ReactNode }) {
  return (
    <LocaleContext.Provider value={ locale }>
      { children }
    </LocaleContext.Provider>
  )
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

/** Client-side counterpart of `getDictionary`. */
export function useDictionary<T>(dictionary: Dictionary<T>): T {
  return dictionary[useLocale()]
}

/**
 * Persists the locale preference in the browser. It is kept in a cookie rather
 * than in `localStorage` so server components can render the right language on
 * the very first request, instead of flashing the auto-detected one.
 */
export function storeLocale(locale: Locale) {
  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=${localeCookieMaxAge}; samesite=lax`
}
