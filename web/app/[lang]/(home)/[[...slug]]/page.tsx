import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMDXComponents } from '@/components/mdx'
import { pagesSource } from '@/lib/source'
import { alternates, localizedUrl, siteName, type Locale } from '@/site.config'

// Standalone pages from content/pages/<locale>/: the landing page (index.mdx), about, legal...
// A page with `full: true` in its frontmatter (the landing page) controls its own layout; the rest get prose styles.
export default async function Page(props: PageProps<'/[lang]/[[...slug]]'>) {
  const { lang, slug } = await props.params
  const page = pagesSource.getPage(slug, lang)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <main className={ page.data.full ? 'w-full' : 'mx-auto w-full max-w-(--fd-layout-width) px-4 py-12 prose' }>
      <MDX components={ getMDXComponents() } />
    </main>
  )
}

export function generateStaticParams() {
  return pagesSource.generateParams('slug', 'lang')
}

export async function generateMetadata(props: PageProps<'/[lang]/[[...slug]]'>): Promise<Metadata> {
  const { lang, slug } = await props.params
  const page = pagesSource.getPage(slug, lang)
  if (!page) notFound()

  const pathname = (slug ?? []).join('/')

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: localizedUrl(lang as Locale, pathname), languages: alternates(pathname) },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: localizedUrl(lang as Locale, pathname),
      siteName,
      locale: lang,
      type: 'website',
    },
  }
}
