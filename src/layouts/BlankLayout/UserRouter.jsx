import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { userRouterConfig } from '../../routerConfig';
import { renderNormalRoute } from '../routerUtil';

export default class userRouter extends Component {
  static displayName = 'index';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Switch>
        {userRouterConfig.map(renderNormalRoute)}
        <Redirect exact strict from="/user/*" to="/user/login" />
      </Switch>
    );
  }
}
