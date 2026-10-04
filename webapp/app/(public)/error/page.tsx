import Error from '@/components/Error'
import { Metadata } from 'next'

import { getDictionary } from '@/lib/i18n/server'
import pageDictionary from './i18n'

type StatusCode = keyof (typeof pageDictionary)['es']['statuses']

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getDictionary(pageDictionary)

  return {
    title: texts.metadataTitle,
    description: texts.metadataDescription,
  }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string, error?: string }> }) {
  const texts = await getDictionary(pageDictionary)
  const { status: rawStatus, error } = await searchParams
  const status: StatusCode = rawStatus === '401' || rawStatus === '403' ? rawStatus : '500'
  const { description } = texts.statuses[status]

  return (
    <Error error={ error || description } />
  )
}
