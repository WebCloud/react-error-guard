import React from 'react';
import {black} from '../styles';

const closeButtonStyle = {
  color: black,
  lineHeight: '1rem',
  fontSize: '1.5rem',
  margin: '1rem',
  cursor: 'pointer',
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex: 2147483647, // ensure always on top
};

function CloseButton({close, closeIcon}) {
  return (
    <a title="Click or press Escape to dismiss." onClick={close} style={closeButtonStyle}>
      {closeIcon
        ? closeIcon
        : '×'
      }
    </a>
  );
}

export default CloseButton;
