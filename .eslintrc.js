module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    "$": true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
    "rules": {
        "semi": [2, "always"],
        "indent": "off"
      }
}
