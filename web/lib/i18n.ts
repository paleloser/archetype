import { defineI18n } from 'fumadocs-core/i18n'

import { defaultLocale, locales } from '@/site.config'

// Content lives in one folder per locale (`content/<collection>/<locale>/...`), and every URL carries its locale
// prefix (`/es/docs`, `/en/docs`): one canonical URL per language, which is what search engines index.
export const i18n = defineI18n({
  languages: [ ...locales ],
  defaultLanguage: defaultLocale,
  hideLocale: 'never',
  parser: 'dir',
})
