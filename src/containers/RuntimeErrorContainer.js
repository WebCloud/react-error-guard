import React, {PureComponent} from 'react';
import ErrorOverlay from '../components/ErrorOverlay';
import CloseButton from '../components/CloseButton';
import NavigationBar from '../components/NavigationBar';
import RuntimeError from './RuntimeError';
import Footer from '../components/Footer';

class RuntimeErrorContainer extends PureComponent {
  state = {
    currentIndex: 0,
  };

  previous = () => {
    this.setState((state, props) => ({
      currentIndex:
        state.currentIndex > 0 ? state.currentIndex - 1 : props.errorRecords.length - 1,
    }));
  };

  next = () => {
    this.setState((state, props) => ({
      currentIndex:
        state.currentIndex < props.errorRecords.length - 1 ? state.currentIndex + 1 : 0,
    }));
  };

  shortcutHandler = key => {
    if (key === 'Escape') {
      this.props.close();
    } else if (key === 'ArrowLeft') {
      this.previous();
    } else if (key === 'ArrowRight') {
      this.next();
    }
  };

  render() {
    const {errorRecords, close} = this.props;
    const totalErrors = errorRecords.length;
    return (
      <ErrorOverlay shortcutHandler={this.shortcutHandler}>
        <CloseButton close={close} />
        {totalErrors > 1 && (
          <NavigationBar
            currentError={this.state.currentIndex + 1}
            totalErrors={totalErrors}
            previous={this.previous}
            next={this.next}
          />
        )}
        <RuntimeError
          errorRecord={errorRecords[this.state.currentIndex]}
          editorHandler={this.props.editorHandler}
        />
        <Footer
          line1="This screen should be used only in development. Ensure you are consumming the ProductionErrorBoundary component on production."
          line2="Open your browser’s developer console to further inspect this error."
        />
      </ErrorOverlay>
    );
  }
}

export default RuntimeErrorContainer;
