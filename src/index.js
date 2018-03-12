import './utils/pollyfills.js';
import {listenToRuntimeErrors} from './listenToRuntimeErrors';
import {applyStyles} from './utils/dom/css';
import ReactDOM from 'react-dom';
import React from 'react';
import CompileErrorContainer from './containers/CompileErrorContainer';
import RuntimeErrorContainer from './containers/RuntimeErrorContainer';
import {overlayStyle, iframeStyle} from './styles';

let editorHandler = null;
let currentBuildError = null;
let currentRuntimeErrorOptions = null;
let stopListeningToRuntimeErrors = null;

function setEditorHandler(handler) {
  editorHandler = handler;
  // if (iframe) {
  //   update();
  // }
}

// function reportBuildError(error) {
//   currentBuildError = error;
//   update();
// }
//
// function dismissBuildError() {
//   currentBuildError = null;
//   update();
// }

function startReportingRuntimeErrors(options = {}) {
  if (stopListeningToRuntimeErrors !== null) {
    throw new Error('Already listening');
  }

  currentRuntimeErrorOptions = options;
  stopListeningToRuntimeErrors = listenToRuntimeErrors(errorRecord => {
    try {
      if (typeof options.onError === 'function') {
        options.onError.call(null);
      }
    } finally {
      this.handleRuntimeError(errorRecord);
    }
  }, options.filename);
}

function handleRuntimeError(errorRecord) {
  if (
    currentRuntimeErrorRecords.some(({error}) => error === errorRecord.error)
  ) {
    // Deduplicate identical errors.
    // This fixes https://github.com/facebook/create-react-app/issues/3011.
    return;
  }
  currentRuntimeErrorRecords = currentRuntimeErrorRecords.concat([errorRecord]);

  this.setState({
    currentRuntimeErrorRecords
  });
}

function dismissRuntimeErrors() {
  this.setState({
    currentRuntimeErrorRecords: []
  });
}

function stopReportingRuntimeErrors() {
  if (stopListeningToRuntimeErrors === null) {
    throw new Error('Not currently listening');
  }

  currentRuntimeErrorOptions = null;

  try {
    stopListeningToRuntimeErrors();
  } finally {
    stopListeningToRuntimeErrors = null;
  }
}

const OuterWrapper = ({children}) => (
  <div style={iframeStyle}>
    <div style={overlay}>{children}</div>
  </div>
);

export default class ErrorBoundaryComponent extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      hasError: false
    };

    this.startReportingRuntimeErrors = startReportingRuntimeErrors.bind(this);
    this.handleRuntimeError = handleRuntimeError.bind(this);
    this.dismissRuntimeErrors = dismissRuntimeErrors.bind(this);

    this.startReportingRuntimeErrors();
  }

  componentWillUnmount() {
    stopReportingRuntimeErrors();
  }

  render() {
    if (process.env.NODE_ENV !== 'production' && (currentBuildError || currentRuntimeErrorRecords.length > 0)) {
      errorHandlerRoot.style.setProperty('display', 'block');
      if (currentBuildError) {
        return (
          <OuterWrapper>
            <CompileErrorContainer
              error={currentBuildError}
              editorHandler={editorHandler}
            />
          </OuterWrapper>
        );
      }
      if (currentRuntimeErrorRecords.length > 0) {
        return (
          <OuterWrapper>
            <RuntimeErrorContainer
              errorRecords={this.state.currentRuntimeErrorRecords}
              close={this.dismissRuntimeErrors}
              editorHandler={editorHandler}
            />
          </OuterWrapper>
        );
      }
    }

    return this.props.children;
  }
}
