import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Menu, Dropdown, Icon, Avatar, Spin } from 'antd';
import classnames from 'classnames';
import config from '../../config';
import styles from './index.less';

const UserMenu = ({ ...otherProps }) => (
  <Menu className={styles.menu} selectedKeys={[]} {...otherProps}>
    <Menu.Item disabled>
      <Icon type="user" />个人中心
    </Menu.Item>
    <Menu.Item disabled>
      <Icon type="setting" />设置
    </Menu.Item>
    <Menu.Item key="triggerError">
      <Icon type="close-circle" />触发报错
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout">
      <Icon type="logout" />退出登录
    </Menu.Item>
  </Menu>
);

@connect(state => ({
  currentUser: _.get(state, 'auth.currentUser'),
}))
class UserMenuFragment extends React.Component {
  handleMenuItemClick = ({ key }) => {
    const handler = this[`handle${_.upperFirst(key)}Click`];
    if (!handler) {
      return;
    }
    handler();
  }

  handleLogoutClick = () => {
    this.props.dispatch({
      type: 'auth/logout',
    });
  }

  render() {
    const { currentUser } = this.props;
    const userMenu = <UserMenu user={currentUser} onClick={this.handleMenuItemClick} />;
    const avatarField = config.get('avatarField');

    return currentUser
      ? (
        <Dropdown overlay={userMenu}>
          <span className={classnames('header-right-action', styles.account)}>
            {
              currentUser[avatarField]
                ? <Avatar size="small" className={styles.avatar} src={currentUser[avatarField]} />
                : <Icon type="user" />
            }
            <span className={styles.name}>{currentUser[config.get('userNameField')]}</span>
          </span>
        </Dropdown>
      ) : (
        <Spin size="small" style={{ marginLeft: 8 }} />
      );
  }
}

export default UserMenuFragment;
