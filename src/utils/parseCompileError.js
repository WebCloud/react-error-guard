//
import Anser from 'anser';

const filePathRegex = /^\.(\/[^/\n ]+)+\.[^/\n ]+$/;

const lineNumberRegexes = [
  // Babel syntax errors
  // Based on syntax error formating of babylon parser
  // https://github.com/babel/babylon/blob/v7.0.0-beta.22/src/parser/location.js#L19
  /^.*\((\d+):(\d+)\)$/,

  // ESLint errors
  // Based on eslintFormatter in react-dev-utils
  /^Line (\d+):.+$/,
];

// Based on error formatting of webpack
// https://github.com/webpack/webpack/blob/v3.5.5/lib/Stats.js#L183-L217
function parseCompileError(message) {
  const lines = message.split('\n');
  let fileName = '';
  let lineNumber = 0;
  let colNumber = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = Anser.ansiToText(lines[i]).trim();
    if (!line) {
      continue;
    }

    if (!fileName && line.match(filePathRegex)) {
      fileName = line;
    }

    let k = 0;
    while (k < lineNumberRegexes.length) {
      const match = line.match(lineNumberRegexes[k]);
      if (match) {
        lineNumber = parseInt(match[1], 10);
        // colNumber starts with 0 and hence add 1
        colNumber = parseInt(match[2], 10) + 1 || 1;
        break;
      }
      k++;
    }

    if (fileName && lineNumber) {
      break;
    }
  }

  return fileName && lineNumber ? {fileName, lineNumber, colNumber} : null;
}

export default parseCompileError;
