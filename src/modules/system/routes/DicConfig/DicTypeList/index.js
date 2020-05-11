import React from 'react';
import { Table } from 'antd';
import styles from './index.less';

const COLUMNS = [{
  title: '字典类型编码',
  key: 'code',
  dataIndex: 'code',
}, {
  title: '字典类型名',
  key: 'name',
  dataIndex: 'name',
}];

export default ({ dicTypeList, selectedCode, onSelect }) => (
  <div className={styles.container}>
    <Table
      columns={COLUMNS}
      dataSource={dicTypeList}
      rowClassName={record => ((selectedCode && selectedCode === record.code) ? styles.active : '')}
      pagination={false}
      bordered
      onRow={record => ({
        onClick: () => onSelect(record.code),
      })}
    />
  </div>
);
