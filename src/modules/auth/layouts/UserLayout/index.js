import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from 'components/GlobalFooter';
import styles from './index.less';
import { getRoutes } from 'utils/utils';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> {platform.moduleConfigs.platform.get('copyright.year')} {platform.moduleConfigs.platform.get('copyright.owner')}
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
                  <img alt="logo" className={styles.logo} src={platform.moduleConfigs.platform.get('logo')} />
                  <span className={styles.title}>{platform.moduleConfigs.platform.get('siteName')}</span>
                </Link>
              </div>
              <div className={styles.desc}>{platform.moduleConfigs.platform.get('siteShotIntro')}</div>
            </div>
            {children}
          </div>
          <GlobalFooter links={platform.moduleConfigs.platform.get('footerLinks')} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
