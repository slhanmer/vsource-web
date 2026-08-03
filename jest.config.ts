import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: ['/node_modules/(?!(.pnpm/)?(pdfjs-dist))'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/stores/(.*)$': '<rootDir>/src/stores/$1',
    '^@stores$': '<rootDir>/src/stores',
    '^@constants$': '<rootDir>/src/constants',
    '^@/utils$': '<rootDir>/src/utils',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@icons$': '<rootDir>/src/assets/icons',
    '^@icons/(.*)$': '<rootDir>/src/assets/icons/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
}

export default createJestConfig(customJestConfig)
