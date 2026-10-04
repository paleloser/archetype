import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMDXComponents } from '@/components/mdx'
import { blogSource } from '@/lib/source'
import { alternates, localizedUrl, type Locale } from '@/site.config'

export default async function Page(props: PageProps<'/[lang]/blog/[slug]'>) {
  const { lang, slug } = await props.params
  const entry = blogSource.getPage([ slug ], lang)
  if (!entry) notFound()

  const MDX = entry.data.body

  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-12'>
      <time className='text-sm text-fd-muted-foreground' dateTime={ entry.data.date.toISOString() }>
        { entry.data.date.toLocaleDateString(lang, { dateStyle: 'long' }) }
      </time>
      <h1 className='mt-2 text-3xl font-bold'>{ entry.data.title }</h1>
      <p className='mt-2 text-lg text-fd-muted-foreground'>{ entry.data.description }</p>
      <article className='prose mt-8'>
        <MDX components={ getMDXComponents() } />
      </article>
    </main>
  )
}

export function generateStaticParams() {
  return blogSource.getPages().map((entry) => ({ lang: entry.locale, slug: entry.slugs[0] }))
}

export async function generateMetadata(props: PageProps<'/[lang]/blog/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await props.params
  const entry = blogSource.getPage([ slug ], lang)
  if (!entry) notFound()

  const pathname = `blog/${slug}`

  return {
    title: entry.data.title,
    description: entry.data.description,
    alternates: { canonical: localizedUrl(lang as Locale, pathname), languages: alternates(pathname) },
    openGraph: { type: 'article', publishedTime: entry.data.date.toISOString(), locale: lang },
  }
}
