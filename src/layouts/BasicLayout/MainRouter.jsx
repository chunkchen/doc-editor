import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { exceptionRouterConfig, routerConfig } from '../../routerConfig';
import NotFound from '../../components/Exception/404';
import { renderNormalRoute } from '../routerUtil';
import './index.scss';

export default class MainRouter extends Component {
  static displayName = 'MainRouter';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Switch>
        <Redirect exact strict from="/" to="/home/full" />
        {renderNormalRoute(routerConfig)}
        {renderNormalRoute(exceptionRouterConfig)}
        <Route component={NotFound} />
      </Switch>
    );
  }
}
