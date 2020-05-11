import React from 'react';
import { set, remove } from 'lodash/fp';
import { Table, Icon, Button, Popconfirm } from 'antd';
import ExModal from 'components/ExModal';
import ColumnEditableTable from 'components/ColumnEditableTable';
import SuperAction from 'components/SuperAction';
import styles from './index.less';

const createNewId = (elements, detail) =>{
  return _.last(elements) ? _.last(elements).id + 1 : 0;
};

export default class TableLayout extends React.Component {

  handleAddRow = () => {
    const { elements, detail, onChange } = this.props;
    if (!onChange) {
      throw new Error('onChange 不是一个函数');
    }

    onChange({
      elements,
      detail: {
        ...detail,
        rows: detail.rows.concat([{}]),
      },
    });
  }

  handleAddCell = (rowIndex, cellKey) => {
    const { elements, detail, createNewElement, onChange } = this.props;
    if (!onChange) {
      throw new Error('onChange 不是一个函数');
    }

    const id = `${rowIndex}-${cellKey}`;

    onChange({
      elements: [ ...elements, { ...createNewElement(), id } ],
      detail: {
        ...detail,
        rows: set([rowIndex, cellKey])(id)(detail.rows),
      },
    });
  }

  handleRemoveRow = (rowIndex) => {
    const { elements, detail, createNewElement, onChange } = this.props;

    onChange({
      elements: _.reject(elements, elt => _.some(detail.rows[rowIndex], v => (v === elt.id))),
      detail: {
        ...detail,
        rows: _.reject(detail.rows, (cell, index) => (rowIndex === index)),
      },
    });
  }

  handleRemoveCell = (element, rowIndex, cellKey) => {
    const { elements, detail, onChange } = this.props;

    onChange({
      elements: remove(item => (item === element))(elements),
      detail: {
        ...detail,
        rows: set([rowIndex, cellKey])(null)(detail.rows),
      },
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
    window.props = this.props;
    const { elements, detail, ElementPlaceholder } = this.props;

    const elementsMap = _.mapKeys(elements, 'id');

    const addRowBtn = (
      <Button className={styles.newButton} onClick={() => this.handleAddRow()}>
        <Icon type="plus" /> 新增行
      </Button>
    );

    const AddCellBtn = ({ rowIndex, cellKey }) => (
      <Button className={styles.newButton} onClick={() => this.handleAddCell(rowIndex, cellKey)}>
        <Icon type="plus" /> 新增
      </Button>
    );

    const renderDesignOpr = (value, elt, rowIndex) => (
      <SuperAction type="remove" onTrigger={() => this.handleRemoveRow(rowIndex)} />
    );

    const designColumns = _.map(detail.columns, col => ({
      ...col,
      render: (value, record, index) => {
        const result = value
          ? (
            <div style={{ position: 'relative' }}>
              <SuperAction.ActionsGroup
                overflow
                actions={{
                  edit: () => this.props.onEdit(value),
                  remove: () => this.handleRemoveCell(value, index, col.dataIndex),
                }}
              >
                <ElementPlaceholder element={value} />
              </SuperAction.ActionsGroup>
            </div>
          ) : <AddCellBtn rowIndex={index} cellKey={col.dataIndex} />;

        if (!col.renderScript || !col.renderScript.code) {
          return result;
        }

        const render = eval(col.renderScript.code);
        return render(result, value, record, index);
      }
    }));

    const rows = _.map(detail.rows, row => _.mapValues(row, cell => elementsMap[cell]));

    return (
      <div>
        <div>
          <ColumnEditableTable
            columns={designColumns}
            dataSource={rows}
            footer={() => addRowBtn}
            onColumnsChange={this.handleColumnsChange}
            renderTmpColumn={renderDesignOpr}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}
