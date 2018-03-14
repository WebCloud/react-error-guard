import React from 'react';
import {darkGray} from '../styles';

const footerStyle = {
  fontFamily: 'sans-serif',
  color: darkGray,
  marginTop: '0.5rem',
  flex: '0 0 auto',
};

function Footer(props) {
  return (
    <div style={footerStyle}>
      {props.line1}
      {props.line2 && <br />}
      {props.line2 || null}
    </div>
  );
}

export default Footer;
