import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: false,
    commaDangle: 'never',
    braceStyle: '1tbs'
  }),
  {
    files: ['index.js', 'test.js'],
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: 'commonjs',
      globals: { console: 'readonly', process: 'readonly' }
    }
  },
  {
    rules: {
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/max-statements-per-line': 'off'
    }
  }
]
