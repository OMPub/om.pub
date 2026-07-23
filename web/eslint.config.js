const nextVitals = require('eslint-config-next/core-web-vitals')

module.exports = [
  ...nextVitals,
  {
    ignores: [
      'eslint.config.backup.js',
      'public/**',
    ],
  },
]
