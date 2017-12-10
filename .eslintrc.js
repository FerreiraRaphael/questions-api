module.exports = {
  extends: ['airbnb-base', 'prettier'],
  env: {
    node: true,
    mocha: true
  },
  globals: {
    describe: false,
    it: false,
    before: false,
    beforeEach: false
  },
  rules: {
    'import/prefer-default-export': 0,
    'linebreak-style': 0
  }
};
