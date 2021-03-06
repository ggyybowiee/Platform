import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message, Menu } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import CONFIG from '../../config';
import HorizontalGlobalHeader from '../../components/HorizontalGlobalHeader';
import GlobalFooter from '../../components/GlobalFooter';
import SiderMenu from '../../components/SiderMenu';
import HorizontalMenu from '../../components/HorizontalMenu';
import NotFound from '../../routes/Exception/404';
import { getRoutes } from '../../utils/utils';
import Authorized from '../../utils/Authorized';
import { getMenuData } from '../../common/menu';
import logo from '../../assets/logo.svg';
import styles from './index.less';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

@connect(state => ({
  app: state.global.app,
  menu: state.module.currentMenu,
  routerData: state.module.routers,
  currentModule: state.module.currentModule,
  fragments: state.module.fragments,
  auth: state.auth,
}))
class HorizontalMenuBasicLayout extends React.PureComponent {

  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(this.props.menu, routerData),
    };
  }
  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'user/getCurrentUser',
    });
    this.props.menu.forEach(getRedirect);
  }
  componentWillUnmount(){
    unenquireScreen(this.enquireHandler);
  }
  getPageTitle() {
    const { routerData, location, currentModule } = this.props;
    const { pathname } = location;
    let title = `${CONFIG.get('documentTitlePrefix')} ${currentModule && currentModule.info && currentModule.info.title || '平台'}`;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${title}`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect && _.get(this.props, 'auth.isLogined')) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath || 'home';
    }
    return redirect;
  };
  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };
  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'auth/logout',
      });
    }
  };

  handleFormTypeClick = ({ key }) => {
    this.props.dispatch(routerRedux.push(key));
  }

  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };
  render() {
    const {
      app,
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location,

      menu,
      // currentModule,
      fragments,
    } = this.props;

    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout className={styles.contentLayout}>
        <Header className={styles.contentHeader}>
          <HorizontalGlobalHeader
            sitename={CONFIG.get('siteName')}
            logo={CONFIG.get('logo')}
            menu={(
              <HorizontalMenu
                app={app}
                sitename={CONFIG.get('siteName')}
                logo={CONFIG.get('logo')}
                // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
                // If you do not have the Authorized parameter
                // you will be forced to jump to the 403 interface without permission
                Authorized={Authorized}
                menuData={_.size(menu) === 1 ? (menu[0].children || []) : menu}
                collapsed={collapsed}
                location={location}
                isMobile={this.state.isMobile}
                onCollapse={this.handleMenuCollapse}
              />
            )}
            currentUser={currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            isMobile={this.state.isMobile}
            fragments={fragments}
            onNoticeClear={this.handleNoticeClear}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onFormTypeClick={this.handleFormTypeClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
          />
        </Header>
        <Content className={styles.contentContent}>
          <Switch>
            {redirectData.map(item => (
              <Redirect key={item.from} exact from={item.from} to={item.to} />
            ))}
            {getRoutes(match.path, routerData).map(item => (
              <AuthorizedRoute
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
                authority={item.authority}
                redirectPath="/exception/403"
              />
            ))}
            <Redirect exact from="/" to={bashRedirect} />
            <Route render={NotFound} />
          </Switch>

          <Footer>
            <GlobalFooter
              links={platform.moduleConfigs.platform.get('footerLinks')}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> {platform.moduleConfigs.platform.get('copyright.year')} {platform.moduleConfigs.platform.get('copyright.owner')}
                </Fragment>
              }
            />
          </Footer>
        </Content>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

const ConnectedHorizontalMenuBasicLayout = connect(({ auth, global, loading }) => ({
  currentUser: auth && auth.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(HorizontalMenuBasicLayout);

export default ConnectedHorizontalMenuBasicLayout;
