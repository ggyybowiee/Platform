import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Button } from 'antd';
import ExModal from 'components/ExModal';
import { getApi } from 'utils/request';
import GrantUserRoleForm from './GrantUserRoleForm';

class GrantUserRole extends React.Component {
  handleClick = () => {
    const onCancel = () => {
      modal.destroy();
    };
    const modal = ExModal.open({
      title: '设置用户角色',
      content: () => <GrantUserRoleForm onCancel={onCancel} user={this.props.user} />,
      footer: false,
    });
  }

  render() {
    return (
      <Button onClick={this.handleClick}>设置角色</Button>
    );
  }
}

export default GrantUserRole;
