import React, { Component } from 'react';
import './index.less';

import AvatarDropdown from './AvatarDropdown';

export default class GlobalHeader extends Component {
  static displayName = 'GlobalHeader';

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
