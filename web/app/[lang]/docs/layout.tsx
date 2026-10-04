import { DocsLayout } from 'fumadocs-ui/layouts/docs'

import { baseOptions } from '@/lib/layout.shared'
import { docsSource } from '@/lib/source'
import type { Locale } from '@/site.config'

export default async function Layout({ children, params }: LayoutProps<'/[lang]/docs'>) {
  const lang = (await params).lang as Locale

  return (
    <DocsLayout tree={ docsSource.getPageTree(lang) } { ...baseOptions(lang) }>
      { children }
    </DocsLayout>
  )
}
