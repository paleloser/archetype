/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emits a self-contained `.next/standalone` server so the Docker image only
  // needs the traced dependencies instead of the whole node_modules tree.
  output: 'standalone',
}

module.exports = nextConfig
