/**
 * 定义应用路由
 */
import { HashRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import { BackTop, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import BasicLayout from './layouts/BasicLayout';
import BlankLayout from './layouts/BlankLayout';


// 按照 Layout 分组路由
// BlankLayout 对应的路由：/user/xxx
// BasicLayout 对应的路由：/xxx
const router = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BackTop />
      <HashRouter>
        <Switch>
          <Route path="/user/*" component={BlankLayout} />
          <Route path="/" component={BasicLayout} />
        </Switch>
      </HashRouter>
    </ConfigProvider>
  );
};

export default router();
