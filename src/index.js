import './utils/pollyfills.js';
import {listenToRuntimeErrors} from './listenToRuntimeErrors';
import {applyStyles} from './utils/dom/css';
import ReactDOM from 'react-dom';
import React from 'react';
import CompileErrorContainer from './containers/CompileErrorContainer';
import RuntimeErrorContainer from './containers/RuntimeErrorContainer';
import {overlayStyle, iframeStyle} from './styles';

let errorHandlerRoot = null;
let errorHandlerReactRoot = null;
let iframe = null;
let isLoadingIframe = false;
var isIframeReady = false;

let editorHandler = null;
let currentBuildError = null;
let currentRuntimeErrorRecords = [];
let currentRuntimeErrorOptions = null;
let stopListeningToRuntimeErrors = null;

export function setEditorHandler(handler) {
  editorHandler = handler;
  if (iframe) {
    update();
  }
}

export function reportBuildError(error) {
  currentBuildError = error;
  update();
}

export function dismissBuildError() {
  currentBuildError = null;
  update();
}

export function startReportingRuntimeErrors(options) {
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
      handleRuntimeError(errorRecord);
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
  update();
}

export function dismissRuntimeErrors() {
  currentRuntimeErrorRecords = [];
  update();
}

export function stopReportingRuntimeErrors() {
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

function update() {
  updateIframeContent();
}

function updateIframeContent() {
  let renderedElement = render();

  if (renderedElement === null) {
    ReactDOM.unmountComponentAtNode(errorHandlerReactRoot);
    return false;
  }
  // Update the overlay
  ReactDOM.render(renderedElement, errorHandlerReactRoot);
}

function render() {
  if (errorHandlerReactRoot == null) {
    errorHandlerReactRoot = document.createElement('div');
    errorHandlerReactRoot.id = 'react-error-guard-root';
    applyStyles(errorHandlerReactRoot, overlayStyle);
    errorHandlerRoot.appendChild(errorHandlerReactRoot);
  }

  if (currentBuildError || currentRuntimeErrorRecords.length > 0) {
    errorHandlerRoot.style.setProperty('display', 'block');
    if (currentBuildError) {
      return (
        <CompileErrorContainer
          error={currentBuildError}
          editorHandler={editorHandler}
        />
      );
    }
    if (currentRuntimeErrorRecords.length > 0) {
      return (
        <RuntimeErrorContainer
          errorRecords={currentRuntimeErrorRecords}
          close={dismissRuntimeErrors}
          editorHandler={editorHandler}
        />
      );
    }
  } else {
    errorHandlerRoot.style.setProperty('display', 'none');
  }

  return null;
}

errorHandlerRoot = document.createElement('div');
errorHandlerRoot.id = 'error-guard-root';
errorHandlerRoot.style.display = 'none';
applyStyles(errorHandlerRoot, iframeStyle);
document.body.appendChild(errorHandlerRoot);
updateIframeContent();
