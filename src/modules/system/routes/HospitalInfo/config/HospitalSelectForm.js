import React from 'react';
import { Button, Input, Table } from 'antd';
import styles from './HospitalSelectForm.less';

const { Search } = Input;

const COLUMNS = [{
  title: '客户编号',
  key: 'code',
  dataIndex: 'hosCode',
}, {
  title: '省份',
  key: 'province',
  dataIndex: 'province',
}, {
  title: '城市',
  key: 'city',
  dataIndex: 'city',
}, {
  title: '医院名称',
  key: 'name',
  dataIndex: 'name',
}];

export default class HospitalSelectForm extends React.Component {
  state = {
    selectedHosCode: null
  }

  handleSelectedRowChange = (selectedRowKeys) => {
    const selectedKey = _.last(selectedRowKeys);
    this.setState({
      selectedHosCode: selectedKey,
    });
    this.props.onSelect(selectedKey);
  }

  render() {
    const { currentHospital = {}, hospitals } = this.props;

    return (
      <div>
        <header className={styles.currentHospital}>当前医院：{currentHospital.name}</header>
        <main>
          <header>
            <p>说明：</p>
            <ol>
              <li>更换客户信息，会影响到数据一致性，对部分系统的数据同步会造成影响</li>
              <li>如果未在下列列表中找到指定的医院，请与公司联系重新维护客户信息，并在数据库中更新客户列表</li>
            </ol>
            <Search placeholder="搜索医院名称模糊检索" />
          </header>
          <main className={styles.main}>
            <Table
              columns={COLUMNS}
              dataSource={hospitals}
              rowKey={record => record.hosCode}
              rowSelection={{
                selectedRowKeys: [this.state.selectedHosCode || currentHospital.hosCode],
                onChange: this.handleSelectedRowChange,
              }} />
          </main>
        </main>
      </div>
    );
  }
};
