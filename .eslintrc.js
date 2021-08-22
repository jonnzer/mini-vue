module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    semi: [2, 'never'], // 不允许分号
    'no-param-reassign': [0, { props: false }], // 允许对传入参数修改
    'no-underscore-dangle': [ // 0 — turn off. 1 — warning, 2 — error
      0,
    ], // 允许this._init这种this.带下划线的
    'import/prefer-default-export': 'off',
    'class-methods-use-this': [0],
    'no-restricted-syntax': [0],
  },
}
