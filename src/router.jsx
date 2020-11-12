import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
import routerConfig from './routerConfig';

/**
 * 渲染路由组件
 * @param config
 * @param parentPath
 * @returns {*}
 */
const renderNormalRoute = (config, parentPath) => {
  if (!config || !config.length) return [];
  let routerList = [];
  config.forEach((item) => {
    let { path } = item;
    if (!path) {
      return;
    }
    if (item.component) {
      if (parentPath) {
        path = parentPath + path;
      }
      const exact = (item.children && item.children.length > 0) || item.exact;
      routerList.push(
        <Route path={path} component={item.component} exact={exact} key={path} />,
      );
    }
    if (item.children && item.children.length) {
      routerList = routerList.concat(renderNormalRoute(item.children, path));
    }
  });
  return routerList;
};

// 按照 Layout 分组路由
// BlankLayout 对应的路由：/user/xxx
// BasicLayout 对应的路由：/xxx
const router = () => (
  <HashRouter>
    <Switch>
      <Redirect exact strict from="/" to="/home/full" />
      {renderNormalRoute(routerConfig)}
    </Switch>
  </HashRouter>
);

export default router();
