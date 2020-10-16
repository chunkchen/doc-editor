import React from 'react';

import { Route } from 'react-router-dom';

/**
 * 渲染路由组件
 * @param item
 * @returns {*}
 */
const renderNormalRoute = (item) => {
  if (item && item.children && item.children.length > 0) {
    return item.children.map(child => (
      <Route
        key={item.path === '/' ? child.path : item.path + child.path}
        path={item.path === '/' ? child.path : item.path + child.path}
        component={child.component}
        exact
      />
    ));
  }
  return (
    <Route key={item.path} path={item.path} component={item.component} exact={item.exact} />);
};

export { renderNormalRoute };
