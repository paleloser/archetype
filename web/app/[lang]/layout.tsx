import { Banner } from 'fumadocs-ui/components/banner'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import { Funnel_Display as FunnelDisplay, Inter } from 'next/font/google'

import { getDictionary } from '@/lib/dictionaries'
import { i18nUI } from '@/lib/i18n-ui'
import { locales, siteName, siteUrl, type Locale } from '@/site.config'

import '../global.css'

// Inter for text, Funnel Display for headings (see global.css).
const inter = Inter({ subsets: [ 'latin' ], variable: '--font-inter' })
const funnelDisplay = FunnelDisplay({ subsets: [ 'latin' ], weight: [ '400', '600', '800' ], variable: '--font-funnel-display' })

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
  const dict = getDictionary(lang)

  return (
    <html lang={ lang } className={ `${inter.variable} ${funnelDisplay.variable}` } suppressHydrationWarning>
      <body className='flex flex-col min-h-screen'>
        <RootProvider i18n={ i18nUI.provider(lang) }>
          { /* Site-wide announcement, in the brand accent. Empty `banner` in i18n/<locale>.json hides it. */ }
          { dict.banner && <Banner className='bg-(--accent) text-white'>🚧 { dict.banner } 🚧</Banner> }
          { children }
        </RootProvider>
      </body>
    </html>
  )
}
