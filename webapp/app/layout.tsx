import './globals.css'

import { Inter } from 'next/font/google'

import { getLocale } from '@/lib/i18n/server'
import { Providers } from './providers'

const inter = Inter({ subsets: [ 'latin' ], variable: '--font-sans' })

export default async function Layout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html lang={ locale } className={ inter.variable } suppressHydrationWarning>
      <body className='bg-background text-foreground min-h-screen'>
        <Providers locale={ locale }>
          { children }
        </Providers>
      </body>
    </html>
  )
}
