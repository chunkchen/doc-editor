import React, { Component } from 'react';
import { Layout } from 'antd';
import './style.less';
import UserRouter from './UserRouter';

export default class BlankLayout extends Component {
  static displayName = 'BlankLayout';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout className="blank-layout">
        <UserRouter />
      </Layout>
    );
  }
}
