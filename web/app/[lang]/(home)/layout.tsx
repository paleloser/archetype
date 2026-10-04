import { Description, Link } from '@heroui/react'
import { HomeLayout } from 'fumadocs-ui/layouts/home'

import { getDictionary } from '@/lib/dictionaries'
import { baseOptions } from '@/lib/layout.shared'
import { contactEmail, siteName, type Locale } from '@/site.config'

export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const lang = (await params).lang as Locale
  const dict = getDictionary(lang)

  return (
    <HomeLayout { ...baseOptions(lang) }>
      { children }
      <footer className='mt-auto border-t border-fd-border font-(family-name:--font-funnel-display)'>
        <div className='mx-auto max-w-(--fd-layout-width) px-4 py-8 flex flex-row justify-between gap-1'>
          <div className='flex flex-col items-start gap-1'>
            <Link href={ `/${lang}/legal` }>{ dict.footer.legal }</Link>
            <Link href={ `/${lang}/terms` }>{ dict.footer.terms }</Link>
            <Link href={ `/${lang}/privacy` }>{ dict.footer.privacy }</Link>
          </div>
          <div className='flex flex-col items-end gap-1'>
            <Link href={ `mailto:${contactEmail}` }>
              { contactEmail }
              <Link.Icon />
            </Link>
            <Description>{ new Date().getFullYear() } © { siteName }.</Description>
          </div>
        </div>
      </footer>
    </HomeLayout>
  )
}
