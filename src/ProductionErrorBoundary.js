import React from 'react';

import ErrorOverlay from './components/ErrorOverlay';
import CloseButton from './components/CloseButton';
import Header from './components/Header';
import Footer from './components/Footer';

export default class ErrorBoundaryComponent extends React.PureComponent {
  state = {
    showErrorMessage: false
  };

  close = () => {
    this.setState({ showErrorMessage: false });

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
        info
      });
    }

    this.setState({
      showErrorMessage: true
    });
  }

  render() {
    const {showErrorMessage, errorMessageComponent} = this.state;

    if (showErrorMessage) {
      return ( errorMessageComponent
        ? (
          <ErrorOverlay shortcutHandler={this.shortcutHandler}>
            <CloseButton close={this.close} />
            {errorMessageComponent}
          </ErrorOverlay>
        )
        : (
          <ErrorOverlay shortcutHandler={this.shortcutHandler}>
            <CloseButton close={this.close} />
            <Header headerText="We're sorry, something has gone wrong." />
            <p>An automated report has been sent to our team.</p>
            <Footer
              line1="You can dismiss this error message by clicking on the close icon above or pressing the Escape key."
              line2="If this error reocurs you can try reloading the page."
            />
          </ErrorOverlay>
        )
      );
    }

    return this.props.children;
  }
}
