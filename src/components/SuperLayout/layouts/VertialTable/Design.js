import React from 'react';
import { Table, Icon, Button } from 'antd';
import ExModal from 'components/ExModal';
import ColumnEditableTable from 'components/ColumnEditableTable';
import SuperAction from 'components/SuperAction';
import styles from './index.less';

const createNewId = (elements, detail) =>{
  return _.last(elements) ? _.last(elements).id + 1 : 0;
};

export default class TableLayout extends React.Component {

  handleAddRow = () => {
    const { elements, detail, createNewElement, onChange } = this.props;
    if (!onChange) {
      throw new Error('onChange 不是一个函数');
    }
    const newId = createNewId(elements, detail);
    const newElement = createNewElement();
    newElement.id = newId;

    onChange({
      elements: [
        ...elements, newElement,
      ],
      detail: {
        ...detail,
        rows: detail.rows.concat([newId]),
      },
    });
  }

  handleRemoveRow = (id) => {
    const { elements, detail, createNewElement, onChange } = this.props;
    if (!onChange) {
      throw new Error('onChange 不是一个函数');
    }

    const elementToRemove = _.find(elements, { id });
    if (!elementToRemove) {
      throw new Error('没有找到需要删除的元素');
    }
    const newElements = [...elements];
    _.remove(newElements, elementToRemove);

    const newDetail = {
      ...detail,
      rows: [...detail.rows]
    };
    _.remove(newDetail.rows, itemIndex => (itemIndex === id));

    onChange({
      elements: newElements,
      detail: newDetail,
    });
  }

  handleColumnsChange = (columns) => {
    const { elements, detail, onChange } = this.props;
    onChange({
      elements,
      detail: {
        ...detail,
        columns,
      },
    });
  }

  render() {
    const { elements, detail, ElementPlaceholder } = this.props;

    const addBtn = (
      <Button className={styles.newButton} onClick={() => this.handleAddRow()}>
        <Icon type="plus" /> 新增行
      </Button>
    );

    const renderDesignOpr = (value, elt) => (
      <SuperAction.ActionsGroup actions={{
        edit: () => this.props.onEdit(elt),
        remove: () => this.handleRemoveRow(elt.id),
      }} />
    );

    const designColumns = _.map(detail.columns, col => col.isRenderElement ? { ...col, render: (value, record) => <ElementPlaceholder element={record} /> } : col);

    return (
      <div>
        <div>
          <ColumnEditableTable
            columns={designColumns}
            dataSource={_.sortBy(elements, elt => _.indexOf(detail.rows, elt.id))}
            footer={() => addBtn}
            onColumnsChange={this.handleColumnsChange}
            renderTmpColumn={renderDesignOpr}
          />
        </div>
      </div>
    );
  }
}
