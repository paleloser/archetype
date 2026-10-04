'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

import { LocaleProvider } from '@/lib/i18n/client'
import type { Locale } from '@/lib/i18n/config'
import { Toast } from '@heroui/react/toast'

export function Providers({ locale, children }: { locale: Locale, children: React.ReactNode }) {
  return (
    <LocaleProvider locale={ locale }>
      <NextThemesProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange>
        <Toast.Provider />
        { children }
      </NextThemesProvider>
    </LocaleProvider>
  )
}
