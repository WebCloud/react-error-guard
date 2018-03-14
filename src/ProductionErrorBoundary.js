import React from 'react';

import ErrorOverlay from './components/ErrorOverlay';
import CloseButton from './components/CloseButton';
import Header from './components/Header';

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
    this.props.dispatchErrorReporting({
      error,
      info
    });

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
            <Header headerText="We're sorry — something's gone wrong." />
            <p>An automated report has been sent to our team.</p>
            <p>You can dismiss this error message by clicking on the close icon above or try again and reload the page</p>
          </ErrorOverlay>
        )
      );
    }

    return this.props.children;
  }
}
