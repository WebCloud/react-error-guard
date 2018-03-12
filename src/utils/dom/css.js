/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*       */
let injectedCount = 0;
const injectedCache = {};

function getHead(document) {
  return document.head || document.getElementsByTagName('head')[0];
}

function injectCss(document, css) {
  const head = getHead(document);
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);

  injectedCache[++injectedCount] = style;
  return injectedCount;
}

function removeCss(document, ref) {
  if (injectedCache[ref] == null) {
    return;
  }
  const head = getHead(document);
  head.removeChild(injectedCache[ref]);
  delete injectedCache[ref];
}

function applyStyles(element, styles) {
  element.setAttribute('style', '');
  for (const key in styles) {
    if (!styles.hasOwnProperty(key)) {
      continue;
    }

    element.style[key] = styles[key];
  }
}

export {getHead, injectCss, removeCss, applyStyles};
