import { Button } from '@heroui/react'
import { Icon } from '@iconify/react'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import Image from 'next/image'
import Link from 'next/link'

import { getDictionary } from '@/lib/dictionaries'
import { appUrl, siteName, type Locale } from '@/site.config'

/** Options shared by the marketing layout (HomeLayout) and the docs layout (DocsLayout). */
export function baseOptions(locale: Locale): BaseLayoutProps {
  const dict = getDictionary(locale)

  return {
    nav: {
      title: (
        <>
          <Image src='/icon.svg' width={ 24 } height={ 24 } alt='' />
          <span className='font-semibold'>{ siteName }</span>
        </>
      ),
      url: `/${locale}`,
    },
    links: [
      { text: dict.nav.docs, url: `/${locale}/docs`, active: 'nested-url' },
      { text: dict.nav.blog, url: `/${locale}/blog`, active: 'nested-url' },
      { text: dict.nav.about, url: `/${locale}/about` },
      {
        // The way into the app, as a HeroUI button
        type: 'custom',
        secondary: true,
        children: (
          <Link href={ appUrl }>
            <Button size='sm'><Icon icon='gravity-ui:triangle-right' /> { dict.nav.openApp }</Button>
          </Link>
        ),
      },
    ],
  }
}
