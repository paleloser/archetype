import { HomeLayout } from 'fumadocs-ui/layouts/home'
import Link from 'next/link'

import { getDictionary } from '@/lib/dictionaries'
import { baseOptions } from '@/lib/layout.shared'
import { contactEmail, siteName, type Locale } from '@/site.config'

export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const lang = (await params).lang as Locale
  const dict = getDictionary(lang)

  return (
    <HomeLayout { ...baseOptions(lang) }>
      { children }
      <footer className='mt-auto border-t border-fd-border'>
        <div className='mx-auto max-w-(--fd-layout-width) px-4 py-8 flex flex-row justify-between gap-4 text-sm text-fd-muted-foreground'>
          <div className='flex flex-col items-start gap-1'>
            <Link href={ `/${lang}/legal` }>{ dict.footer.legal }</Link>
          </div>
          <div className='flex flex-col items-end gap-1'>
            <a href={ `mailto:${contactEmail}` }>{ contactEmail }</a>
            <span>{ new Date().getFullYear() } © { siteName }. { dict.footer.rights }</span>
          </div>
        </div>
      </footer>
    </HomeLayout>
  )
}
