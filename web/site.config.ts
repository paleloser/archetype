// Single source of truth for the public site's identity and languages. Read by the i18n setup, the sitemap and every
// page's <head>, so the hreflang alternates declared in all of them match exactly.
export const siteName = 'acme'
export const siteUrl = 'https://acme.example'
export const appUrl = 'https://app.acme.example'
export const contactEmail = 'hello@acme.example'

// The first locale is the source: content is written in it first, then translated.
export const locales = [ 'es', 'en' ] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'es'

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

// Absolute URL for `pathname` (no leading/trailing slash, '' for the locale
// root) under `locale`, e.g. localizedUrl('en', 'about') -> https://acme.example/en/about
export function localizedUrl(locale: Locale, pathname = '', host = siteUrl) {
  return pathname ? `${host}/${locale}/${pathname}` : `${host}/${locale}`
}

// The hreflang alternates of a page, for its <head> and for the sitemap.
export function alternates(pathname = '', host = siteUrl) {
  return {
    ...Object.fromEntries(locales.map((locale) => [ locale, localizedUrl(locale, pathname, host) ])),
    'x-default': localizedUrl(defaultLocale, pathname, host),
  }
}
