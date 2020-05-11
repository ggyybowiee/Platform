import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon } from 'antd';
import _ from 'lodash';
import TableLayout from 'layouts/TableLayout';
import { createSimpleRestActions } from 'utils/createSimpleRestModel';
import ExModal from 'components/ExModal';
import CONFIG from '../../config';
import styles from './index.less';
import GrantPermissionForms from './GrantPermissionForms';

const debouncedFetchPermissions = _.debounce(dispatch => {
  return dispatch({
    type: 'permissions/fetchList',
  });
}, 300);

@connect(({ roles, permissions }) => ({
  list: _.get(roles, 'list'),
  permissions: _.get(permissions, 'list'),
  rolePermissionMap: _.get(roles, 'rolePermissionMap'),
}))
export default class RolesPage extends Component {
  constructor(props) {
    super(props);

    this.columns = CONFIG.get('roles.list').columns;

    this.itemFormConfigs = {
      create: CONFIG.get('roles.createForm'),
      edit: CONFIG.get('roles.editForm'),
    };
  }

  componentDidMount() {
    debouncedFetchPermissions(this.props.dispatch);
  }

  grantPermissions = (role) => {
    const onCancel = () => modal.destroy();
    const onSave = (values) => {
      this.saveGrantPermissions(values);
      modal.destroy()
    };
    const modal = ExModal.open({
      title: '分配权限',
      content: () => (
        <GrantPermissionForms
          permissions={this.props.permissions}
          role={role}
          onCancel={onCancel}
          onSave={onSave}
        />
      ),
      width: 520,
      footer: false,
    });
    return modal;
  }

  render() {
    const { list } = this.props;
    const data = {
      list,
    };

    return (
      <TableLayout
        name="角色"
        title="角色列表"
        columns={this.columns}
        data={data}
        oprsInline
        rowOprs={[
          'edit',
          ({ item: role }) => (
            <Button onClick={() => this.grantPermissions(role)}>
              <Icon type="profile" />
            </Button>
          ),
          'delete',
        ]}
        bordered
        modalItemFormConfigs={this.itemFormConfigs}
        curdHandles={createSimpleRestActions('roles', this.props.dispatch)}
      />
    );
  }
}
