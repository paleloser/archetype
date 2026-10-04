import './globals.css'

import { Funnel_Display as FunnelDisplay, Inter } from 'next/font/google'

import { getLocale } from '@/lib/i18n/server'
import { Providers } from './providers'

// Inter for text, Funnel Display for headings (see globals.css).
const inter = Inter({ subsets: [ 'latin' ], variable: '--font-inter' })
const funnelDisplay = FunnelDisplay({ subsets: [ 'latin' ], weight: [ '300', '400', '600', '800' ], variable: '--font-funnel-display' })

export default async function Layout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html lang={ locale } className={ `${inter.variable} ${funnelDisplay.variable}` } suppressHydrationWarning>
      <body className='bg-background text-foreground flex flex-row min-h-screen'>
        <Providers locale={ locale }>
          { children }
        </Providers>
      </body>
    </html>
  )
}
