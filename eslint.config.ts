import antfu from '@antfu/eslint-config'

export default antfu(
  {
    rules: {
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',
      'ts/consistent-type-definitions': 'off',
    },
    formatters: true,
  },
)
