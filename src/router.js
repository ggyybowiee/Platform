import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import Empty from './routes/Exception/Empty';

import HorizontalMenuBasicLayout from './layouts/HorizontalMenuBasicLayout';
import SideMenuBasicLayout from './layouts/BasicLayout';
import BlankLayout from './routes/BlankPage';

import extraRoutes from './common/resultRouter';
import Authorized from './utils/Authorized';
import styles from './index.less';

import Exception403 from './routes/Exception/403';
import Exception404 from './routes/Exception/404';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

const renderLayout = (props) => {
  const { app, routers, match } = props;
  const layoutMap = {
    blank: BlankLayout,
    horizontal: HorizontalMenuBasicLayout,
    vertical: SideMenuBasicLayout,
    otherwise: props => <Exception404 {...props} empty />,
  };
  const layout = match.params.layout;

  const Comp = layoutMap[layout] || layoutMap.otherwise;

  return (
    <Comp {...props} />
  );
}

@connect(state => ({
  routers: state.module.routers,
}))
class RouterConfig extends React.Component {

  render() {
    const { history, app, routers } = this.props;

    return (
      <LocaleProvider locale={zhCN}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={(props) => <Empty {...props} />} />
            {_.map(extraRoutes, ({ component }, path) => {
              return <Route path={path} component={component} />;
            })}
            <Route path="/blank" component={BlankLayout} />
            <Route path="/:app/:layout" component={renderLayout} />
          </Switch>
        </ConnectedRouter>
      </LocaleProvider>
    );
  }
}

export default props => (
  <RouterConfig {...props} />
);
