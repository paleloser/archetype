import 'server-only'

import type { Locale } from '@/site.config'
import es from '@/i18n/es.json'
import en from '@/i18n/en.json'

// The site chrome's strings (navigation, footer...). Page content is translated by having one MDX file per locale, not
// through dictionaries. `es` is the source: every other locale must have the same shape.
export type Dictionary = typeof es

const dictionaries: Record<Locale, Dictionary> = { es, en: en as Dictionary }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
