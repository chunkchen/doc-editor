import React, { Component } from 'react';
import './index.scss';

export default class Stamp extends Component {
  static displayName = 'Stamp';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { text, style } = this.props;
    const showText = text || 'Stamp';
    return (
      <div className="stamp-wrapper" style={style}>
        <div className="out-circle" style={style ? { borderColor: style.color } : '#c1c5c7'}>
          <div className="inner-circle">
            <span className="text">
              {showText}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
