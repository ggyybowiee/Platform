import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from 'components/GlobalFooter';
import styles from './index.less';
import logo from '../../../../assets/logo.svg';
import { getRoutes } from 'utils/utils';

const links = [
  {
    key: '联新移动医疗',
    title: '联新移动医疗',
    href: 'http://www.lachesis-mh.cn/',
    blankTarget: true,
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 联新研发部出品
  </Fragment>
);

class UserLayout extends React.PureComponent {
  render() {
    const { title, children } = this.props;
    return (
      <DocumentTitle title={title}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>{platform.moduleConfigs.platform.get('siteName')}</span>
                </Link>
              </div>
              <div className={styles.desc}>联接无界·以智赋能</div>
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
