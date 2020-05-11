import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import _ from 'lodash';
import TableLayout from 'layouts/TableLayout';
import { createSimpleRestActions } from 'utils/createSimpleRestModel';
import CONFIG from '../../config';
import styles from './index.less';

@connect(({ user, module: moduleModel }) => ({
  users: _.get(user, 'list'),
  pagination: _.get(user, 'pagination'),
  rowActionsFragments: _.get(moduleModel, ['fragments', 'user-list-rowActions']),
}))
export default class UsersPage extends Component {
  constructor(props) {
    super(props);

    this.columns = CONFIG.get('list').columns;

    this.itemFormConfigs = {
      create: CONFIG.get('createForm'),
      edit: CONFIG.get('editForm'),
    }
  }

  handleCameraClick(item) {
  }

  render() {
    const { users, rowActionsFragments, pagination } = this.props;
    const data = {
      list: users,
    };
    const fragments = rowActionsFragments
      ? _.chain(rowActionsFragments)
          .map(fargment => {
            return fargment.comp ? (() => fargment.comp) : fargment.Comp;
          })
          .flatten()
          .value()
      : [];

    return (
      <TableLayout
        title="用户列表"
        columns={this.columns}
        data={data}
        filterConfig={CONFIG.get('filterConfig')}
        oprsInline
        rowOprs={[
          'edit',
          ...fragments,
          'delete',
        ]}
        agination={true}
        bordered
        serverPagination
        pagination={{
          ...pagination,
          orderBy: 'createTime.desc',
        }}
        modalItemFormConfigs={this.itemFormConfigs}
        curdHandles={createSimpleRestActions('user', this.props.dispatch)}
      />
    );
  }
}
