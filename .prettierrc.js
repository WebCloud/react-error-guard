module.exports = {
  bracketSpacing: false,
  singleQuote: true,
  jsxBracketSameLine: true,
  trailingComma: 'es5',
  printWidth: 80,

  overrides: [
    {
      files: './src/**/*.js',
      options: {
        trailingComma: 'all',
      },
    },
  ],
};
