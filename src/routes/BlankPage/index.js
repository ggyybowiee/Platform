import React from 'react';
import { connect } from 'dva';
import { Link, Redirect, Switch, Route } from 'dva/router';
import { getRoutes } from 'utils/utils';

@connect(state => ({
  routers: state.module && state.module.routers,
  auth: _.get(state, 'auth'),
}))
export default class BlankPage extends React.Component {
  render() {
    const { routers, match } = this.props;

    return (
      <Switch>
        {getRoutes(match.path, routers).map(item => (
          <Route
            key={item.key}
            path={item.path}
            component={item.component}
            exact={item.exact}
          />
        ))}
        <Redirect exact from="/blank/auth" to="/blank/auth/login" />
      </Switch>
    );
  }
}
