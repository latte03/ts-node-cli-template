process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['@antfu', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'antfu/if-newline': 'off',
    'no-console': 'off',
  },
}
