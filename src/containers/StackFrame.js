import React, {Component} from 'react';
import CodeBlock from './StackFrameCodeBlock';
import {getPrettyURL} from '../utils/getPrettyURL';
import {darkGray} from '../styles';

const linkStyle = {
  fontSize: '0.9em',
  marginBottom: '0.9em',
};

const anchorStyle = {
  textDecoration: 'none',
  color: darkGray,
  cursor: 'pointer',
};

const codeAnchorStyle = {
  cursor: 'pointer',
};

const toggleStyle = {
  marginBottom: '1.5em',
  color: darkGray,
  cursor: 'pointer',
  border: 'none',
  display: 'block',
  width: '100%',
  textAlign: 'left',
  background: '#fff',
  fontFamily: 'Consolas, Menlo, monospace',
  fontSize: '1em',
  padding: '0px',
  lineHeight: '1.5',
};

class StackFrame extends Component {
  state = {
    compiled: false,
  };

  toggleCompiled = () => {
    this.setState(state => ({
      compiled: !state.compiled,
    }));
  };

  getErrorLocation() {
    const {_originalFileName: fileName, _originalLineNumber: lineNumber} = this.props.frame;
    // Unknown file
    if (!fileName) {
      return null;
    }
    // e.g. "/path-to-my-app/webpack/bootstrap eaddeb46b67d75e4dfc1"
    const isInternalWebpackBootstrapCode = fileName.trim().indexOf(' ') !== -1;
    if (isInternalWebpackBootstrapCode) {
      return null;
    }
    // Code is in a real file
    return {fileName, lineNumber: lineNumber || 1};
  }

  editorHandler = () => {
    const errorLoc = this.getErrorLocation();
    if (!errorLoc) {
      return;
    }
    this.props.editorHandler(errorLoc);
  };

  onKeyDown = e => {
    if (e.key === 'Enter') {
      this.editorHandler();
    }
  };

  render() {
    const {frame, contextSize, critical, showCode} = this.props;
    const {
      fileName,
      lineNumber,
      columnNumber,
      _scriptCode: scriptLines,
      _originalFileName: sourceFileName,
      _originalLineNumber: sourceLineNumber,
      _originalColumnNumber: sourceColumnNumber,
      _originalScriptCode: sourceLines,
    } = frame;
    const functionName = frame.getFunctionName();

    const compiled = this.state.compiled;
    const url = getPrettyURL(
      sourceFileName,
      sourceLineNumber,
      sourceColumnNumber,
      fileName,
      lineNumber,
      columnNumber,
      compiled
    );

    let codeBlockProps = null;
    if (showCode) {
      if (compiled && scriptLines && scriptLines.length !== 0 && lineNumber != null) {
        codeBlockProps = {
          lines: scriptLines,
          lineNum: lineNumber,
          columnNum: columnNumber,
          contextSize,
          main: critical,
        };
      } else if (
        !compiled &&
        sourceLines &&
        sourceLines.length !== 0 &&
        sourceLineNumber != null
      ) {
        codeBlockProps = {
          lines: sourceLines,
          lineNum: sourceLineNumber,
          columnNum: sourceColumnNumber,
          contextSize,
          main: critical,
        };
      }
    }

    const canOpenInEditor =
      this.getErrorLocation() !== null && this.props.editorHandler !== null;
    return (
      <div>
        <div>{functionName}</div>
        <div style={linkStyle}>
          <span
            style={canOpenInEditor ? anchorStyle : null}
            onClick={canOpenInEditor ? this.editorHandler : null}
            onKeyDown={canOpenInEditor ? this.onKeyDown : null}
            tabIndex={canOpenInEditor ? '0' : null}>
            {url}
          </span>
        </div>
        {codeBlockProps && (
          <span>
            <span
              onClick={canOpenInEditor ? this.editorHandler : null}
              style={canOpenInEditor ? codeAnchorStyle : null}>
              <CodeBlock {...codeBlockProps} />
            </span>
            <button style={toggleStyle} onClick={this.toggleCompiled}>
              {'View ' + (compiled ? 'source' : 'compiled')}
            </button>
          </span>
        )}
      </div>
    );
  }
}

export default StackFrame;
