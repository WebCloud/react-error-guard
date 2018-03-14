import {parse} from './parser';
import {map} from './mapper';
import {unmap} from './unmapper';

function getStackFrames(error, unhandledRejection = false, contextSize = 3) {
  const parsedFrames = parse(error);
  let enhancedFramesPromise;

  if (error.__unmap_source) {
    enhancedFramesPromise = unmap(error.__unmap_source, parsedFrames, contextSize);
  } else {
    enhancedFramesPromise = map(parsedFrames, contextSize);
  }

  return enhancedFramesPromise.then(enhancedFrames => {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (isDevelopment) {
      if (
        enhancedFrames
          .map(f => f._originalFileName)
          .filter(f => f != null && f.indexOf('node_modules') === -1).length === 0
      ) {
        return null;
      }
    }

    return enhancedFrames.filter(
      ({functionName}) =>
        functionName == null ||
        functionName.indexOf('__stack_frame_overlay_proxy_console__') === -1
    );
  });
}

export default getStackFrames;
export {getStackFrames};
