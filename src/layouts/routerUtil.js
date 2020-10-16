import React from 'react';

import { Route } from 'react-router-dom';

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
    let path = item.path;
    if (!path) {
      return;
    }
    if (item.component) {
      if (parentPath) {
        path = parentPath + path;
      }
      const exact = (item.children && item.children.length > 0) || item.exact;
      routerList.push(
        <Route path={path} component={item.component} exact={exact} key={path} />
      );
    }
    if (item.children && item.children.length) {
      routerList = routerList.concat(renderNormalRoute(item.children, path));
    }
  });
  return routerList;
};

export { renderNormalRoute };
