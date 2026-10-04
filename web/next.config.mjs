import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // public/fonts is also used by the webapp and the identity provider's hosted login page, so they share the site's
  // typography. Add their origins here.
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://app.acme.example, https://auth.acme.example',
          },
        ],
      },
    ]
  },
  // Emits a self-contained `.next/standalone` server so the Docker image only
  // needs the traced dependencies instead of the whole node_modules tree.
  output: 'standalone',
}

export default withMDX(config)
