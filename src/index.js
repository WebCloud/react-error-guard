import './utils/pollyfills.js';
import {listenToRuntimeErrors} from './listenToRuntimeErrors';
import {applyStyles} from './utils/dom/css';
import ReactDOM from 'react-dom';
import React from 'react';
import CompileErrorContainer from './containers/CompileErrorContainer';
import RuntimeErrorContainer from './containers/RuntimeErrorContainer';
import {overlayStyle, iframeStyle} from './styles';
import getStackFrames from './utils/getStackFrames';

let editorHandler = null;
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
    return; // components get reinstanciated.
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
  let { currentRuntimeErrorRecords } = this.state;

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
    <div style={overlayStyle}>{children}</div>
  </div>
);

export default class ErrorBoundaryComponent extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      currentRuntimeErrorRecords: []
    };

    this.startReportingRuntimeErrors = startReportingRuntimeErrors.bind(this);
    this.handleRuntimeError = handleRuntimeError.bind(this);
    this.dismissRuntimeErrors = dismissRuntimeErrors.bind(this);

    if (this.props.detachedTree) {
      this.startReportingRuntimeErrors();
    }
  }

  componentDidCatch(error, info) {
    getStackFrames(error, false, 3)
      .then(stackFrames => {
        if (stackFrames == null) {
          return;
        }

        this.handleRuntimeError({
          error,
          unhandledRejection: false,
          contextSize: 3,
          stackFrames,
        });
      })
      .catch(e => {
        console.log('Could not get the stack frames of error:', e);
      });
  }

  componentWillUnmount() {
    stopReportingRuntimeErrors();
  }

  render() {
    const { currentRuntimeErrorRecords, currentBuildError } = this.state;

    if (process.env.NODE_ENV !== 'production' && (currentBuildError || currentRuntimeErrorRecords.length > 0)) {
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
              errorRecords={currentRuntimeErrorRecords}
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
