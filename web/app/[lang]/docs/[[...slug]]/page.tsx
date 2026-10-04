import { createRelativeLink } from 'fumadocs-ui/mdx'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMDXComponents } from '@/components/mdx'
import { docsSource } from '@/lib/source'
import { alternates, localizedUrl, type Locale } from '@/site.config'

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const { lang, slug } = await props.params
  const page = docsSource.getPage(slug, lang)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={ page.data.toc } full={ page.data.full }>
      <DocsTitle>{ page.data.title }</DocsTitle>
      <DocsDescription>{ page.data.description }</DocsDescription>
      <DocsBody>
        <MDX
          components={ getMDXComponents({
            // Lets pages link to each other with relative file paths
            a: createRelativeLink(docsSource, page),
          }) } />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return docsSource.generateParams('slug', 'lang')
}

export async function generateMetadata(props: PageProps<'/[lang]/docs/[[...slug]]'>): Promise<Metadata> {
  const { lang, slug } = await props.params
  const page = docsSource.getPage(slug, lang)
  if (!page) notFound()

  const pathname = [ 'docs', ...(slug ?? []) ].join('/')

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: localizedUrl(lang as Locale, pathname), languages: alternates(pathname) },
  }
}
