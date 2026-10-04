import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware'

import { i18n } from '@/lib/i18n'

// Redirects locale-less URLs (`/docs`) to the visitor's language (`/es/docs`), from Accept-Language.
export default createI18nMiddleware(i18n)

export const config = {
  matcher: [
    // Skip these
    '/((?!api|_next/static|_next/image|images|videos|fonts|raw|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)',
  ],
}
