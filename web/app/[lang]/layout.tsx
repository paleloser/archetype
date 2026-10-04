import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { i18nUI } from '@/lib/i18n-ui'
import { locales, siteName, siteUrl, type Locale } from '@/site.config'

import '../global.css'

const inter = Inter({ subsets: [ 'latin' ] })

// /[lang]/... catches every path, so a request with no real locale prefix (a browser's automatic /favicon.ico, a bot
// probing /wp-admin...) would land here with `lang` set to that literal segment. Only the known locales are rendered;
// anything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s · ${siteName}`,
    },
  }
}

export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const lang = (await params).lang as Locale

  return (
    <html lang={ lang } className={ inter.className } suppressHydrationWarning>
      <body className='flex flex-col min-h-screen'>
        <RootProvider i18n={ i18nUI.provider(lang) }>
          { children }
        </RootProvider>
      </body>
    </html>
  )
}
