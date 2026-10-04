import { NextRequest, NextResponse } from 'next/server'

import { auth0 } from './lib/auth0'
import { localeCookieName, resolveLocale } from './lib/i18n/config'
import { AccessTokenError } from '@auth0/nextjs-auth0/errors'

/**
 * Makes Auth0's login and sign-up screens use the webapp's language instead of only the browser's.
 * The SDK forwards `/auth/login`'s query params to Auth0 as authorization params.
 */
function withLoginLocale(request: NextRequest): NextRequest {
  if (request.nextUrl.pathname !== '/auth/login' || request.nextUrl.searchParams.has('ui_locales')) {
    return request
  }

  const url = request.nextUrl.clone()
  url.searchParams.set('ui_locales', resolveLocale(
    request.cookies.get(localeCookieName)?.value,
    request.headers.get('accept-language')
  ))

  return new NextRequest(url, request)
}

export async function proxy(request: NextRequest) {
  const authRes = await auth0.middleware(withLoginLocale(request)) // Returns a NextResponse object

  // Ensure your own middleware does not handle the `/auth` routes, auto-mounted and handled by the SDK
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return authRes
  }

  try {
    // Any route that gets to this point is a protected route, and requires the user to be logged in
    const { origin, pathname } = new URL(request.url)
    const session = await auth0.getSession(request)

    if (!session) {
      // The root path is the app's main entry point, so send logged-out users straight to login instead of the generic error page
      if (pathname === '/') {
        return NextResponse.redirect(`${origin}/auth/login`)
      }

      // Otherwise, redirect to the generic error page with enough context to resume the flow
      return NextResponse.redirect(`${origin}/error?status=401&returnTo=${encodeURIComponent(pathname)}`)
    }
  } catch (error) {
    if (error instanceof AccessTokenError) {
      const logoutUrl = new URL('/auth/logout', request.url)
      logoutUrl.searchParams.set('returnTo', '/')

      return NextResponse.redirect(logoutUrl)
    }

    console.error('Error in auth0 middleware:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}/error?status=500&returnTo=${encodeURIComponent(request.nextUrl.pathname)}`)
  }

  // If a valid session exists, continue with the response from Auth0 middleware
  return authRes
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the public ones (the `(public)` route group) and:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|error|favicon.ico|icon.svg|sitemap.xml|robots.txt).*)'
  ]
}
