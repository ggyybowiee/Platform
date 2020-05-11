import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import _ from 'lodash';
import TableLayout from 'layouts/TableLayout';
import { createSimpleRestActions } from 'utils/createSimpleRestModel';
import CONFIG from '../../config';
import LIST_CONFIG from './config/list';
import FILTER_CONFIG from './config/filter';
import CREATE_FORM_CONFIG from './config/createFormConfig';
import EDIT_FORM_CONFIG from './config/editFormConfig';
import styles from './index.less';

@connect(({ sysConfigInfo }) => ({
  list: _.get(sysConfigInfo, 'list'),
  pagination: _.get(sysConfigInfo, 'pagination'),
}))
export default class SystemConfigPage extends Component {

  handleResetToFactorySettingClick = () => {
    // TODO:
  }

  render() {
    const { list, pagination } = this.props;
    const data = {
      list,
    };

    return (
      <TableLayout
        title="系统配置"
        columns={LIST_CONFIG.columns}
        data={data}
        filterConfig={FILTER_CONFIG}
        oprsInline
        size="small"
        rowOprs={[
          'edit',
          'delete',
        ]}
        oprs={[
          'create',
          (<Button onClick={this.handleResetToFactorySettingClick}>恢复出厂设置</Button>)
        ]}
        bordered
        modalItemFormConfigs={{
          create: CREATE_FORM_CONFIG,
          edit: EDIT_FORM_CONFIG,
        }}
        curdHandles={createSimpleRestActions('sysConfigInfo', this.props.dispatch)}
        serverPagination
        pagination={pagination}
      />
    );
  }
}
