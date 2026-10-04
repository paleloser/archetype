import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import stylistic from '@stylistic/eslint-plugin'

const config = [
  ...nextCoreWebVitals,
  {
    plugins: {
      '@stylistic': stylistic,
    },

    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/semi': ['error', 'never'],

      '@stylistic/jsx-curly-spacing': ['error', {
        when: 'always',
        children: true,
      }],

      '@stylistic/jsx-child-element-spacing': 'error',

      'camelcase': ['error', {
        properties: 'never',
      }],

      'no-console': ['error', {
        allow: ['warn', 'error'],
      }],
    },
  },
]

export default config