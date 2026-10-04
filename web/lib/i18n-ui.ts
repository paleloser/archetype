import { defineI18nUI } from 'fumadocs-ui/i18n'

import en from '@/i18n/en.json'
import es from '@/i18n/es.json'
import { i18n } from './i18n'

// Fumadocs' own UI strings (search, table of contents, pagination...), plus each language's name for the switcher.
// Keys are the English strings Fumadocs ships with; English needs no overrides.
export const i18nUI = defineI18nUI(i18n, {
  es: { displayName: es.displayName, ...es.ui },
  en: { displayName: en.displayName, ...en.ui },
})
