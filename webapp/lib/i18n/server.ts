import { cookies, headers } from 'next/headers'

import { Locale, localeCookieName, resolveLocale } from './config'
import type { Dictionary } from './dictionary'

/** Resolves the locale for the current request, see `resolveLocale`. */
export async function getLocale(): Promise<Locale> {
  return resolveLocale(
    (await cookies()).get(localeCookieName)?.value,
    (await headers()).get('accept-language')
  )
}

/** Server-side counterpart of `useDictionary`. */
export async function getDictionary<T>(dictionary: Dictionary<T>): Promise<T> {
  return dictionary[await getLocale()]
}
