/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node'],
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
      },
    ],
  },
};
