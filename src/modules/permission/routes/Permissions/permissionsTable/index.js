import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import TableLayout from 'layouts/TableLayout';
import { createSimpleRestActions } from 'utils/createSimpleRestModel';
import CONFIG from '../../../config';
import styles from './index.less';

@connect(({ permissions }) => ({
  list: _.get(permissions, 'list'),
  pagination: _.get(permissions, 'pagination'),
}))
export default class PermissionsPage extends Component {

  constructor(props) {
    super(props);

    this.columns = CONFIG.get('permissions.list').columns;

    this.itemFormConfigs = {
      create: CONFIG.get('permissions.createForm'),
      edit: CONFIG.get('permissions.editForm'),
    }
  }

  render() {
    const { list, pagination, location } = this.props;

    return (
      <TableLayout
        title="权限列表"
        name="权限"
        columns={this.columns}
        data={{ list }}
        oprsInline
        rowOprs={[
          'edit',
          'delete',
        ]}
        bordered
        modalItemFormConfigs={this.itemFormConfigs}
        filterConfig={CONFIG.get('permissions.filterConfig')}
        curdHandles={createSimpleRestActions('permissions', this.props.dispatch)}
        location={location}
        pagination={pagination}
      />
    );
  }
}
