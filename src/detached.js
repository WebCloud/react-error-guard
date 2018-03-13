import {listenToRuntimeErrors} from './listenToRuntimeErrors';

let currentRuntimeErrorOptions = null;
let stopListeningToRuntimeErrors = null;

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
