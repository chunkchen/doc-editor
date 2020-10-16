import React, { Component } from 'react';
import './index.less';

import AvatarDropdown from './AvatarDropdown';

export default class Index extends Component {
  static displayName = 'index';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="right">
        <AvatarDropdown />
      </div>
    );
  }
}
