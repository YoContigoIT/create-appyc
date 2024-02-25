module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'prettier/prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: ['test/**/*'],
      env: {
        jest: true
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
    'prettier/prettier': ['error'],
    'no-console': 'warn',
    eqeqeq: 'error'
  }
}
