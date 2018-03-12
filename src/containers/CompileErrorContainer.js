/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*       */
import React, {PureComponent} from 'react';
import ErrorOverlay from '../components/ErrorOverlay';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CodeBlock from '../components/CodeBlock';
import generateAnsiHTML from '../utils/generateAnsiHTML';
import parseCompileError from '../utils/parseCompileError';

const codeAnchorStyle = {
  cursor: 'pointer',
};

class CompileErrorContainer extends PureComponent {
  render() {
    const {error, editorHandler} = this.props;
    const errLoc = parseCompileError(error);
    const canOpenInEditor = errLoc !== null && editorHandler !== null;
    return (
      <ErrorOverlay>
        <Header headerText="Failed to compile" />
        <div
          onClick={
            canOpenInEditor && errLoc ? () => editorHandler(errLoc) : null
          }
          style={canOpenInEditor ? codeAnchorStyle : null}>
          <CodeBlock main={true} codeHTML={generateAnsiHTML(error)} />
        </div>
        <Footer line1="This error occurred during the build time and cannot be dismissed." />
      </ErrorOverlay>
    );
  }
}

export default CompileErrorContainer;
