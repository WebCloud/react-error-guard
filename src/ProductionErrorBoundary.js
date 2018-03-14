import React from 'react';

import ErrorOverlay from './components/ErrorOverlay';
import CloseButton from './components/CloseButton';
import Header from './components/Header';
import Footer from './components/Footer';

export default class ErrorBoundaryComponent extends React.PureComponent {
  state = {
    showErrorMessage: false,
  };

  close = () => {
    this.setState({showErrorMessage: false});

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  shortcutHandler = key => {
    if (key === 'Escape') {
      this.close();
    }
  };

  componentDidCatch(error, info) {
    if (this.props.dispatchErrorReporting) {
      this.props.dispatchErrorReporting({
        error,
        info,
      });
    }

    this.setState({
      showErrorMessage: true,
    });
  }

  render() {
    const {showErrorMessage} = this.state;
    const {errorMessageComponent, closeIcon} = this.props;

    if (showErrorMessage) {
      return errorMessageComponent ? (
        <ErrorOverlay shortcutHandler={this.shortcutHandler}>
          {errorMessageComponent}
          <CloseButton close={this.close} closeIcon={closeIcon} />
        </ErrorOverlay>
      ) : (
        // ensure the CloseButton will be place on the top of whatever we get as errorMessageComponent
        <ErrorOverlay shortcutHandler={this.shortcutHandler}>
          <CloseButton close={this.close} closeIcon={closeIcon} />
          <Header headerText="We're sorry, something has gone wrong." />
          {this.props.dispatchErrorReporting ? (
            <p>An automated report has been sent to our team.</p>
          ) : null}
          <Footer
            line1="You can dismiss this error message by clicking on the close icon above or pressing the Escape key."
            line2="If this error reocurs you can try reloading the page."
          />
        </ErrorOverlay>
      );
    }

    return this.props.children;
  }
}
