import React, { Component } from 'react';
import { Layout } from 'antd';
import MainRouter from './MainRouter';

import './index.scss';

const { Content } = Layout;

export default class BasicLayout extends Component {
  static displayName = 'BasicLayout';

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <Layout className="basic-layout">
        <Layout
          style={{
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <Content className="global-content">
            <MainRouter />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
