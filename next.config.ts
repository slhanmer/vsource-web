import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  serverExternalPackages: ['canvas'],

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

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

export default nextConfig
