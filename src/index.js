import React from 'react';

import {overlayStyle, iframeStyle} from './styles';
import getStackFrames from './utils/getStackFrames';

import RuntimeErrorContainer from './containers/RuntimeErrorContainer';
let editorHandler = null;

function setEditorHandler(handler) {
  editorHandler = handler;
}

function handleRuntimeError(errorRecord) {
  let {currentRuntimeErrorRecords} = this.state;

  if (
    currentRuntimeErrorRecords.some(({error}) => error === errorRecord.error)
  ) {
    // Deduplicate identical errors.
    // This fixes https://github.com/facebook/create-react-app/issues/3011.
    return;
  }

  currentRuntimeErrorRecords = currentRuntimeErrorRecords.concat([errorRecord]);

  this.setState({
    currentRuntimeErrorRecords,
  });
}

function dismissRuntimeErrors() {
  this.setState({
    currentRuntimeErrorRecords: [],
  });
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
      currentRuntimeErrorRecords: [],
    };

    this.handleRuntimeError = handleRuntimeError.bind(this);
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

  render() {
    const {currentRuntimeErrorRecords} = this.state;

    if (
      // TODO: Add this later
      // process.env.NODE_ENV !== 'production' &&
      currentRuntimeErrorRecords.length > 0
    ) {
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

    return this.props.children;
  }
}
