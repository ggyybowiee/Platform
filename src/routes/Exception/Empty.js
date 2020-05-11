import React from 'react';
import { Button, Alert, Tag, Spin } from 'antd';
import { connect } from 'dva';
import { Link, Redirect, Switch } from 'dva/router';
import _ from 'lodash';

class Empty extends React.Component {
  state = {}

  componentWillMount() {
    setTimeout(() => {
      const { accessibleApp } = this.props;

      this.setState({
        accessibleApp,
      });
    }, 3000);
  }

  render() {
    const { dispatch, auth } = this.props;
    const { accessibleApp } = this.state;
    const wrapStyle = {
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    };

    if (_.isUndefined(accessibleApp)) {
      return (
        <div style={wrapStyle}>
          <Spin spinning />
        </div>
      );
    }

    if (accessibleApp) {
      return <Redirect to={`${accessibleApp.code}${accessibleApp.homePath}`} />
    }

    const renderOthers = () => {
      const otherRoles = _.chain(auth)
        .get('roles')
        .filter(item => item.roleCode !== _.get(auth, 'currentRole.roleCode'))
        .value();

      if (_.isEmpty(otherRoles)) {
        return null;
      }

      return (
        <span>
          您可切换其他角色：
          {
            _.map(otherRoles, item => (
              <Button
                type="default"
                onClick={() => {
                  dispatch({
                    type: 'roles/switchRole',
                    payload: item.roleCode,
                  })
                }}
              >{item.roleName}</Button>
            ))
          }。
          或
        </span>
      );
    }

    const renderPermissions = () => {
      if (!accessibleApp) {
        return '未分配任何应用权限';
      }

      return (
        <Redirect to={`${accessibleApp.code}${accessibleApp.homePath}`} />
      );
    };

    return (
      <div style={wrapStyle}>
        <Alert
          style={{
            marginBottom: '20px',
          }}
          message="温馨提醒"
          description={(
            <div>您当前角色<Tag >{_.get(auth, 'currentRole.roleName')}</Tag>{renderPermissions()}，{renderOthers()}或联系管理员授权后重新登录。</div>
          )}
          type="warning"
          showIcon
        />
        <Button type="primary" onClick={() => {
          dispatch({
            type: 'auth/logout',
          });
        }}>退出</Button>
      </div>
    );
  }
}

export default connect((state) => ({
  auth: _.get(state, 'auth'),
  currentPermissions: _.get(state, 'permissions.currentPermissions'),
  accessibleApp: _.get(state, 'permissions.accessibleApp'),
}))(Empty);
