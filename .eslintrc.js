module.exports = {
  extends: ['airbnb-typescript/base'],
  parserOptions: {
    project: ['./tsconfig.json', './test/tsconfig.json'],
  },
  rules: {
    "no-plusplus": "off",
    "max-len": ["error", 120],
    "@typescript-eslint/indent": ["error", 4],
    "@typescript-eslint/lines-between-class-members": "off",
    "import/prefer-default-export": "off"
  }
};
