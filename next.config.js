const AutoImport = require('unplugin-auto-import/webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  webpack(config) {
    config.plugins.push(
      AutoImport({
        dts: './src/auto-imports.d.ts',
        dirs: [
          './src/shared/components/*.tsx',
        ],
      })
    )

    return config
  },
}

module.exports = nextConfig