import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { routerConfig, exceptionRouterConfig } from '../../routerConfig';
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
        <Redirect exact strict from="/" to="/home/blank" />
        <Redirect exact strict from="/home" to="/home/blank" />
        {routerConfig.map(renderNormalRoute)}
        {exceptionRouterConfig.map(renderNormalRoute)}
        <Route component={NotFound} />
      </Switch>
    );
  }
}
