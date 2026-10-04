import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Typography } from '@heroui/react'
import { Metadata } from 'next'
import { LanguageSwitcher } from './_components'

import { getDictionary } from '@/lib/i18n/server'
import pageDictionary from './i18n'

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getDictionary(pageDictionary)

  return {
    title: texts.metadataTitle,
    description: texts.metadataDescription,
  }
}

export default async function Page() {
  const texts = await getDictionary(pageDictionary)

  return (
    <>
      <Typography type='h1'>{ texts.title }</Typography>
      <Typography type='body-sm' color='muted'>{ texts.description }</Typography>
      <div className='mt-6 flex flex-col sm:flex-row gap-6'>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </>
  )
}
