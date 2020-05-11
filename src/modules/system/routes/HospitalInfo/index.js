import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon } from 'antd';
import _ from 'lodash';
import TableLayout from 'layouts/TableLayout';
import { createSimpleRestActions } from 'utils/createSimpleRestModel';
import ExModal from 'components/ExModal';
import JsonForm from 'components/JsonForm';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import CONFIG from '../../config';
import FORM_CONFIG from './config/form';
import styles from './index.less';

@connect(({ sysHospitalInfo }) => ({
  hospitalInfo: _.get(sysHospitalInfo, 'hospitalInfo'),
}))
export default class HospitalInfoPage extends Component {
  handleSubmit = (values) =>{
    this.props.dispatch({
      type: 'sysHospitalInfo/saveHospitalInfo',
      payload: values,
    });
  }

  render() {
    const { hospitalInfo } = this.props;

    return (
      <PageHeaderLayout title="医院信息配置">
        <JsonForm {...FORM_CONFIG.form} data={hospitalInfo} onSubmit={this.handleSubmit} key={JSON.stringify(hospitalInfo)} />
      </PageHeaderLayout>
    );
  }
}
