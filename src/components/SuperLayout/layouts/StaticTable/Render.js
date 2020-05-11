import React from 'react';
import { Table } from 'antd';
import styles from './index.less';

export default ({ elements, detail, Element }) => {
    const elementsMap = _.mapKeys(elements, 'id');

    const renderColumns = _.map(detail.columns, col => ({
      ...col,
      render: (value, record, rowIndex) => {
        const result = value && <Element {...value} />;
        if (!col.renderScript || !col.renderScript.code) {
          return result;
        }

        const render = eval(col.renderScript.code);
        return render(result, value, record, rowIndex);
      },
    }));

    const rows = _.map(detail.rows, row => _.mapValues(row, cell => elementsMap[cell]));

    return (
      <Table
        columns={renderColumns}
        dataSource={rows}
        pagination={false}
      />
    );
}
