import React from 'react';
import { remove, set } from 'lodash/fp';
import { Table, Row, Col, Card, Icon, Popconfirm, Badge, Tag, Button, Popover } from 'antd';
import ExModal from 'components/ExModal';
import SuperAction from 'components/SuperAction';
import TableColumnForm from './TableColumnForm';
import styles from './index.less';

const createNewId = (elements, detail) =>{
  return _.last(elements) ? _.last(elements).id + 1 : 0;
};

export default class ColumnEditableTable extends React.Component {
  state = {
    columns: [],
    autoIndex: 'A'.charCodeAt(),
  }

  handleEdit = (col) => {
    const onSubmit = (values) => {
      const { columns, onUpdateColumn, onColumnsChange } = this.props;
      const colIndex = _.indexOf(columns, col);
      const newCol = { ...col, ...values };
      if (onUpdateColumn) {
        onUpdateColumn(newCol, colIndex, col);
      } else if (onColumnsChange) {
        onColumnsChange(set(colIndex)(newCol)(columns));
      }
      modal.destroy();
    };
    const modal = ExModal.open({
      title: '编辑列',
      content: () => <TableColumnForm column={col} onSubmit={onSubmit} />,
      footer: false,
      width: '86%',
    });
  }

  handleAddColumn = () => {
    const { columns, onColumnsChange } = this.props;
    const { autoIndex } = this.state;
    const newIndex = String.fromCharCode(autoIndex);
    onColumnsChange && onColumnsChange(
      columns.concat([{
        title: `新列${newIndex}`,
        dataIndex: `值索引${newIndex}`,
        key: `唯一标识key--${newIndex}`,
      }])
    );
    this.setState({
      autoIndex: autoIndex + 1,
    });
  }

  handleRemoveCol = (col) => {
    const { columns, onColumnsChange } = this.props;
    onColumnsChange && onColumnsChange({
      columns: remove(col)(columns)
    });
    return;
  }

  handleOkClick = () => {
    this.props.onOk(this.state.columns);
  }

  render() {
    const { columns, onCancel, renderTmpColumn } = this.props;

    const addBtn = (
      <Button type="dashed" className={styles.newButton} onClick={this.handleAddColumn}>
        <Icon type="plus" /> 新增列
      </Button>
    );

    const ItemEditor = ({ elt }) => (
      <SuperAction.ActionsGroup actions={{
        edit: () => this.handleEdit(elt),
        remove: () => this.handleRemoveCol(elt)
      }} />
    );

    const designColumns = [
      ..._.map(columns, col => ({
        ...col,
        title: (
          <div>
            {col.title}
            <ItemEditor elt={col} />
          </div>
        )
      })),
      {
        title: addBtn,
        dataIndex: '__tmpOpr__',
        key: '__tmpOpr__',
        render: renderTmpColumn,
      },
    ];

    return (
      <Table
        {...this.props}
        columns={designColumns}
      />
    )
  }
}
