/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_SANITY_DATASET: 'production',
    NEXT_PUBLIC_SANITY_PROJECT_ID: '8pmdtce9'
  },
}

module.exports = nextConfig
