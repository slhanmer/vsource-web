import type { StorybookConfig } from '@storybook/nextjs-vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/components/ui-kit/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-onboarding'],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['..\\public'],
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@images': path.resolve(__dirname, '../src/assets/images'),
      '@icons': path.resolve(__dirname, '../src/assets/icons'),
      '@stores': path.resolve(__dirname, '../src/stores'),
      '@constants': path.resolve(__dirname, '../src/constants'),
      '@providers': path.resolve(__dirname, '../src/providers'),
      '@configs': path.resolve(__dirname, '../src/configs'),
      '@features': path.resolve(__dirname, '../src/features'),
      '@services': path.resolve(__dirname, '../src/services'),
      '@tokens': path.resolve(__dirname, '../src/styles/_tokens.scss'),
    }

    config.css = {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${path.resolve(__dirname, '../src/styles/_tokens.scss').replace(/\\/g, '/')}" as *;\n`,
        },
      },
    }

    return config
  },
}

export default config
