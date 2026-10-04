import stylistic from '@stylistic/eslint-plugin'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import * as eslintMdx from 'eslint-mdx'
import * as mdx from 'eslint-plugin-mdx'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const sharedReactRules: Record<string, unknown> = {
  '@stylistic/jsx-curly-spacing': ['error', 'always'],
  '@stylistic/jsx-child-element-spacing': 'error',
  '@stylistic/jsx-quotes': ['error', 'prefer-single'],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/semi': ['error', 'never'],
  '@stylistic/object-curly-spacing': ['error', 'always'],
  '@stylistic/comma-dangle': ['error', 'only-multiline'],
}

const config = [
  {
    ignores: [
      '.next/**',
      '.source/**',
      'node_modules/**',
      'public/**',
    ],
  },
  ...nextCoreWebVitals,
  ...tseslint.configs.recommended,
  {
    files: [
      '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      ...sharedReactRules,
      '@stylistic/indent': ['error', 2],
    }
  },
  {
    files: ['**/eslint.config.mts'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    }
  },
  {
    files: ['**/*.mdx'],
    processor: mdx.createRemarkProcessor(),
    languageOptions: {
      parser: eslintMdx,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      mdx,
      '@stylistic': stylistic,
    },
    rules: {
      ...sharedReactRules,
      'mdx/remark': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]

export default config
