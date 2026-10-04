// The first locale is the source: dictionaries are written in it, and every other one is typed against it.
export const locales = [ 'es', 'en' ] as const

export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'es'

// Same cookie name Next.js' built-in i18n routing uses, so the stored preference
// stays meaningful if we ever switch to it.
export const localeCookieName = 'NEXT_LOCALE'

export const localeCookieMaxAge = 60 * 60 * 24 * 365

// Language names are always written in their own language, never translated.
export const localeLabels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

/**
 * Picks the best supported locale out of an `Accept-Language` header, honouring
 * quality values and ignoring region subtags (`en-GB` matches `en`).
 */
export function localeFromAcceptLanguage(header: string | undefined | null): Locale | undefined {
  if (!header) {
    return undefined
  }

  const preferences = header
    .split(',')
    .map(entry => {
      const [ tag, ...params ] = entry.trim().split(';')
      const quality = params
        .map(param => param.trim())
        .find(param => param.startsWith('q='))

      return { tag: tag.trim().toLowerCase(), quality: quality ? Number(quality.slice(2)) : 1 }
    })
    .filter(preference => preference.tag !== '' && !Number.isNaN(preference.quality))
    .sort((a, b) => b.quality - a.quality)

  for (const { tag } of preferences) {
    const language = tag.split('-')[0]

    if (isLocale(language)) {
      return language
    }
  }

  return undefined
}

/**
 * Resolves the locale for a request: an explicit preference stored in the browser
 * wins, otherwise it is auto-detected from the browser's languages.
 */
export function resolveLocale(preference: string | undefined | null, acceptLanguage: string | undefined | null): Locale {
  if (isLocale(preference)) {
    return preference
  }

  return localeFromAcceptLanguage(acceptLanguage) || defaultLocale
}
