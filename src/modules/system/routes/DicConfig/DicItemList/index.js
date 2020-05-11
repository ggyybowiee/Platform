import React from 'react';
import { Table, Button } from 'antd';
import SuperAction from 'components/SuperAction';
import ExModal from 'components/ExModal';
import EDIT_FORM_CONIFG from '../config/editFormConfig';
import styles from './index.less';

const COLUMNS = [{
  title: '字典项编码',
  key: 'code',
  dataIndex: 'dicCode',
}, {
  title: '字典项名',
  key: 'name',
  dataIndex: 'dicName',
}, {
  title: '说明',
  key: 'desc',
  dataIndex: 'description',
}];

const handleEditClick = (record, onUpdate) => {
  ExModal.form({
    title: `编辑 ${record.name}`,
    formInfo: EDIT_FORM_CONIFG,
    values: record,
    onSave: (values) => onUpdate(values, record),
  });
};

const handleDeleteClick = (record, onDelete) => {
  alert('TODO: ');
};

export default ({ dicItemList, onUpdate, onDelete }) => (
  <div className={styles.container}>
    <Table
      columns={[
        ...COLUMNS, {
          title: '操作',
          key: '__opr',
          dataIndex: '__opr',
          render: (value, record) => (
            <SuperAction.ActionsGroup
              actions={[{
                key: 'edit',
                type: 'edit',
                onTrigger: () => handleEditClick(record, onUpdate),
              }, {
                key: 'remove',
                type: 'remove',
                onTrigger: () => onDelete(record),
              }]}
            />
          )
        }
      ]}
      dataSource={dicItemList}
      pagination={false}
      bordered
    />
  </div>
);
