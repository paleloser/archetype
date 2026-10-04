import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Emits a self-contained `.next/standalone` server so the Docker image only
  // needs the traced dependencies instead of the whole node_modules tree.
  output: 'standalone',
}

export default withMDX(config)
