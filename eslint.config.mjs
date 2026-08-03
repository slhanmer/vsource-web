// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import storybook from 'eslint-plugin-storybook'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import unusedImports from 'eslint-plugin-unused-imports'

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'storybook-static/**',
      'coverage/**',
    ],
  },
  ...nextVitals,
  ...nextTypescript,
  ...storybook.configs['flat/recommended'],
  {
    plugins: {
      prettier: eslintPluginPrettier,
      'unused-imports': unusedImports,
    },
    rules: {
      // Portal is auth-gated — LCP optimisation doesn't apply, and every image
      // is either a runtime data URL (QR codes, screenshots, signatures) or a
      // tenant-config URL from an origin we can't enumerate in remotePatterns.
      '@next/next/no-img-element': 'off',
      'prettier/prettier': ['error', { semi: false }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'storybook/no-renderer-packages': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react/no-unescaped-entities': 'warn',
      'react/display-name': 'warn',
      semi: ['error', 'never'],
    },
  },
]

export default eslintConfig
