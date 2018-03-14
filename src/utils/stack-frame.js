/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** A container holding a script line. */
class ScriptLine {
  /** The line number of this line of source. */

  /** The content (or value) of this line of source. */

  /** Whether or not this line should be highlighted. Particularly useful for error reporting with context. */

  constructor(lineNumber, content, highlight = false) {
    this.lineNumber = lineNumber;
    this.content = content;
    this.highlight = highlight;
  }
}

/**
 * A representation of a stack frame.
 */
class StackFrame {
  constructor(
    functionName = null,
    fileName = null,
    lineNumber = null,
    columnNumber = null,
    scriptCode = null,
    sourceFunctionName = null,
    sourceFileName = null,
    sourceLineNumber = null,
    sourceColumnNumber = null,
    sourceScriptCode = null
  ) {
    if (functionName && functionName.indexOf('Object.') === 0) {
      functionName = functionName.slice('Object.'.length);
    }
    if (
      // Chrome has a bug with inferring function.name:
      // https://github.com/facebook/create-react-app/issues/2097
      // Let's ignore a meaningless name we get for top-level modules.
      functionName === 'friendlySyntaxErrorLabel' ||
      functionName === 'exports.__esModule' ||
      functionName === '<anonymous>' ||
      !functionName
    ) {
      functionName = null;
    }
    this.functionName = functionName;

    this.fileName = fileName;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;

    this._originalFunctionName = sourceFunctionName;
    this._originalFileName = sourceFileName;
    this._originalLineNumber = sourceLineNumber;
    this._originalColumnNumber = sourceColumnNumber;

    this._scriptCode = scriptCode;
    this._originalScriptCode = sourceScriptCode;
  }

  /**
   * Returns the name of this function.
   */
  getFunctionName() {
    return this.functionName || '(anonymous function)';
  }

  /**
   * Returns the source of the frame.
   * This contains the file name, line number, and column number when available.
   */
  getSource() {
    let str = '';
    if (this.fileName != null) {
      str += this.fileName + ':';
    }
    if (this.lineNumber != null) {
      str += this.lineNumber + ':';
    }
    if (this.columnNumber != null) {
      str += this.columnNumber + ':';
    }
    return str.slice(0, -1);
  }

  /**
   * Returns a pretty version of this stack frame.
   */
  toString() {
    const functionName = this.getFunctionName();
    const source = this.getSource();
    return `${functionName}${source ? ` (${source})` : ``}`;
  }
}

export {StackFrame, ScriptLine};
export default StackFrame;
