import { Card } from '@heroui/react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { getDictionary } from '@/lib/dictionaries'
import { blogSource } from '@/lib/source'
import { alternates, localizedUrl, type Locale } from '@/site.config'

export default async function Page(props: PageProps<'/[lang]/blog'>) {
  const lang = (await props.params).lang as Locale
  const dict = getDictionary(lang)
  const entries = blogSource.getPages(lang).sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  return (
    <main className='mx-auto w-full max-w-(--fd-layout-width) px-4 py-12'>
      <h1 className='text-3xl font-bold'>{ dict.blog.title }</h1>
      <p className='mt-2 text-fd-muted-foreground'>{ dict.blog.description }</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
        {
          entries.map((entry) =>
            <Card key={ entry.url }>
              <Card.Header>
                <Card.Title>{ entry.data.title }</Card.Title>
                <Card.Description>{ entry.data.description }</Card.Description>
              </Card.Header>
              <Card.Footer className='flex items-center justify-between'>
                <time className='text-sm text-fd-muted-foreground' dateTime={ entry.data.date.toISOString() }>
                  { entry.data.date.toLocaleDateString(lang, { dateStyle: 'long' }) }
                </time>
                <Link href={ entry.url } className='button button--secondary'>{ dict.blog.read }</Link>
              </Card.Footer>
            </Card>
          )
        }
      </div>
    </main>
  )
}

export async function generateMetadata(props: PageProps<'/[lang]/blog'>): Promise<Metadata> {
  const lang = (await props.params).lang as Locale
  const dict = getDictionary(lang)

  return {
    title: dict.blog.title,
    description: dict.blog.description,
    alternates: { canonical: localizedUrl(lang, 'blog'), languages: alternates('blog') },
  }
}
