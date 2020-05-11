import React from 'react';
import { Table } from 'antd';
import styles from './index.less';

export default ({ elements, detail, Element }) => {
    const elementsMap = _.mapKeys(elements, 'id');

    const renderColumns = _.map(detail.columns, col => col.isRenderElement ? { ...col, render: (value, record) => <Element {...record} /> } : col);

    return (
      <Table
        columns={renderColumns}
        dataSource={
          _.sortBy(elements, elt => _.indexOf(detail.rows, row => (row === elt.id)))
        } />
    );
}
