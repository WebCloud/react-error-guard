const reactFrameStack = [];

// This is a stripped down barebones version of this proposal:
// https://gist.github.com/sebmarkbage/bdefa100f19345229d526d0fdd22830f
// We're implementing just enough to get the invalid element type warnings
// to display the component stack in React 15.6+:
// https://github.com/facebook/react/pull/9679
/// TODO: a more comprehensive implementation.

const registerReactStack = () => {
  if (typeof console !== 'undefined') {
    console.reactStack = frames => reactFrameStack.push(frames);
    console.reactStackEnd = frames => reactFrameStack.pop();
  }
};

const unregisterReactStack = () => {
  if (typeof console !== 'undefined') {
    console.reactStack = undefined;
    console.reactStackEnd = undefined;
  }
};

const permanentRegister = function proxyConsole(type, callback) {
  if (typeof console !== 'undefined') {
    const orig = console[type];
    if (typeof orig === 'function') {
      console[type] = function __stack_frame_overlay_proxy_console__() {
        try {
          const message = arguments[0];
          if (typeof message === 'string' && reactFrameStack.length > 0) {
            callback(message, reactFrameStack[reactFrameStack.length - 1]);
          }
        } catch (err) {
          // Warnings must never crash. Rethrow with a clean stack.
          setTimeout(function() {
            throw err;
          });
        }
        return orig.apply(this, arguments);
      };
    }
  }
};

export {permanentRegister, registerReactStack, unregisterReactStack};
