import React from 'react';
import { Table } from 'antd';
import styles from './index.less';

export default ({ dataSource, elements, detail, Element }) => {
    const elementsMap = _.mapKeys(elements, 'id');

    const renderColumns = _.map(detail.columns, col => ({
      ...col,
      render: (value, record) =>
        elementsMap[col.dataIndex]
        ? <Element {...elementsMap[col.dataIndex]} />
        : null,
    }));

    // const rows = _.map(detail.rows, row => _.mapValues(row, cell => elementsMap[cell]));

    return (
      <Table
        columns={renderColumns}
        dataSource={dataSource ? (dataSource instanceof Array ? dataSource : [dataSource]) : []}
        pagination={false}
      />
    );
}
