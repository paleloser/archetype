import type { MetadataRoute } from 'next'

import { blogSource, docsSource, pagesSource } from '@/lib/source'
import { alternates } from '@/site.config'

// Every localized page, each with its hreflang alternates, matching the ones in its <head>.
export default function sitemap(): MetadataRoute.Sitemap {
  const pathnames = new Set<string>()

  for (const source of [ pagesSource, docsSource, blogSource ]) {
    for (const page of source.getPages()) {
      // page.url is `/<locale>/<path>`: drop the locale to group translations together.
      pathnames.add(page.url.split('/').slice(2).join('/'))
    }
  }

  return [ ...pathnames ].sort().map((pathname) => {
    const languages = alternates(pathname)

    return {
      url: languages['x-default'],
      lastModified: new Date(),
      alternates: { languages },
    }
  })
}

export const dynamic = 'force-static'
