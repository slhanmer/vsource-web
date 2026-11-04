import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  serverExternalPackages: ['canvas'],

  // Media is served from Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },

  // Two root layouts, (site) and (payload), so an unmatched URL has no layout
  // above it. global-not-found.tsx renders our 404 for those.
  experimental: {
    globalNotFound: true,
  },

  /**
   * Permanent redirects for routes that have been renamed on a live site.
   *
   * Every rename ships WITH its redirect, in the same change. A renamed route
   * without one drops whatever ranking and inbound links the old URL had, and
   * the loss is silent — nothing errors, the page simply stops existing for
   * anyone who had the old address.
   *
   * 308, not 302: `permanent: true` tells a crawler to move its index across
   * rather than keep checking the old one.
   */
  async redirects() {
    return [
      // The showpiece. "Work" became a gallery of projects rather than one
      // case study, and the name went with it.
      { source: '/work', destination: '/built', permanent: true },

      // One offer per stream replaced the five-offers-on-one-page version.
      // Home is the destination rather than /software: someone arriving at
      // /services is asking "what do you do", and the three moves under the
      // fold answer that better than any one stream does.
      { source: '/services', destination: '/', permanent: true },

      // Craig dislikes "crew". The nav label changed in August; the route did
      // not, because a rename without its redirect is a silent loss.
      { source: '/crew', destination: '/team', permanent: true },
    ]
  },

  webpack: (config, { isServer }) => {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: ['@svgr/webpack'],
      },
      // Package SVGs (Payload's admin assets) are files, not components. Next
      // drops .svg from its own image loader once a custom svg rule exists, so
      // without this they have no loader at all and the build fails.
      { test: /\.svg$/i, include: /node_modules/, type: 'asset/resource' },
    )

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@testData': path.resolve(__dirname, 'src/testData'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@providers': path.resolve(__dirname, 'src/providers'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@tokens': path.resolve(__dirname, 'src/styles/_tokens.scss'),
    }

    const oneOfRules = config.module.rules.find((rule: any) => typeof rule.oneOf === 'object')

    if (oneOfRules) {
      oneOfRules.oneOf.forEach((rule: any) => {
        if (Array.isArray(rule.use)) {
          rule.use.forEach((useEntry: any) => {
            if (useEntry.loader?.includes('sass-loader') && useEntry.options) {
              useEntry.options.additionalData = `
                @use "@tokens" as *;
                ${useEntry.options.additionalData || ''}
              `
            }
          })
        }
      })
    }

    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas']
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    }

    return config
  },
}

export default withPayload(nextConfig)
