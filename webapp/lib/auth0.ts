import { AuthorizationError } from '@auth0/nextjs-auth0/errors'
import { Auth0Client } from '@auth0/nextjs-auth0/server'
import { NextResponse } from 'next/server'

// Pages to send users to when an Auth0 Action denies their login, keyed by the code it denies it with.
// e.g. { email_not_verified: '/verify-email' }
const denialPages: Record<string, string> = {}

export const auth0 = new Auth0Client({
  authorizationParameters: {
    // The API identifier in Auth0. Access tokens are issued for it, and the server validates them.
    audience: process.env.NEXT_PUBLIC_API_ENDPOINT,
    scope: 'openid email profile offline_access'
  },
  onCallback: async (error, context) => {
    if (error) {
      const denial = error instanceof AuthorizationError && error.cause.code === 'access_denied'
        ? error.cause.message
        : undefined

      // Auth0 Actions deny logins with a code rather than a message. Some of them are an expected step, not an error
      if (denial && Object.hasOwn(denialPages, denial)) {
        return NextResponse.redirect(
          new URL(denialPages[denial], process.env.APP_BASE_URL)
        )
      }

      return NextResponse.redirect(
        new URL(`/error?error=${encodeURIComponent(denial || error.message)}`, process.env.APP_BASE_URL)
      )
    }

    // First login of a user is the place to provision them in the backend, if the product needs it.

    return NextResponse.redirect(
      new URL(context.returnTo || '/', process.env.APP_BASE_URL)
    )
  },
  tokenRefreshBuffer: 60
})
