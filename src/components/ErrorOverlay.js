import React, {Component} from 'react';
import {black} from '../styles';

const overlayStyle = {
  position: 'relative',
  display: 'inline-flex',
  flexDirection: 'column',
  height: '100%',
  width: '1024px',
  maxWidth: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: '0.5rem',
  boxSizing: 'border-box',
  textAlign: 'left',
  fontFamily: 'Consolas, Menlo, monospace',
  fontSize: '11px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  lineHeight: 1.5,
  color: black,
};

class ErrorOverlay extends Component {
  frameWindow = null;

  getIframeWindow = element => {
    if (element) {
      const document = element.ownerDocument;
      this.frameWindow = document.defaultView;
    }
  };

  onKeyDown = e => {
    const {shortcutHandler} = this.props;
    if (shortcutHandler) {
      shortcutHandler(e.key);
    }
  };

  componentDidMount() {
    if (this.props.shortcutHandler) {
      this.frameWindow.addEventListener('keydown', this.onKeyDown);
    }
  }

  componentWillUnmount() {
    if (this.props.shortcutHandler) {
      this.frameWindow.removeEventListener('keydown', this.onKeyDown);
    }
  }

  render() {
    return (
      <div style={overlayStyle} ref={this.getIframeWindow}>
        {this.props.children}
      </div>
    );
  }
}

export default ErrorOverlay;
