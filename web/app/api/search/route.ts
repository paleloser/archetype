import { createFromSource } from 'fumadocs-core/search/server'

import { docsSource } from '@/lib/source'

// Built-in Orama search over the docs, one index per locale with its own stemmer.
export const { GET } = createFromSource(docsSource, {
  localeMap: {
    es: { language: 'spanish' },
    en: { language: 'english' },
  },
})
