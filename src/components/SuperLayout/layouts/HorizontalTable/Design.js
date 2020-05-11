import React from 'react';
import { set, remove } from 'lodash/fp';
import { Table, Icon, Button } from 'antd';
import ExModal from 'components/ExModal';
import ColumnEditableTable from 'components/ColumnEditableTable';
import SuperAction from 'components/SuperAction';
import styles from './index.less';

const createNewId = elements =>{
  return _.last(elements) ? _.last(elements).id + 1 : 0;
};

export default class HorizontalTableLayout extends React.Component {

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

  handleAddCell = (colDataIndex) => {
    const { elements, detail, createNewElement, onChange } = this.props;
    if (!onChange) {
      throw new Error('onChange 不是一个函数');
    }

    onChange({
      elements: [ ...elements, { ...createNewElement(), id: colDataIndex } ],
      detail,
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

  handleRemoveCell = (element) => {
    const { elements, detail, onChange } = this.props;

    onChange({
      elements: remove(item => (item === element))(elements),
      detail,
    });
  }

  handleColumnsChange = (columns) => {
    const { elements, columns: oldColumns, detail, onChange } = this.props;

    onChange({
      elements: _.filter(elements, elt => _.some(detail.columns, col => (col.dataIndex === elt.id))),
      detail: {
        ...detail,
        columns,
      },
    });
  }

  handleColumnUpdate = (col, colIndex) => {
    const { elements, detail, onChange } = this.props;
    const { columns } = detail;

    const oldCol = columns[colIndex];
    const eltIndex = _.findIndex(elements, { id: oldCol.dataIndex });

    onChange({
      elements: eltIndex === -1 ? elements : set([eltIndex, 'id'])(col.dataIndex)(elements),
      detail: {
        ...detail,
        columns: set(colIndex)(col)(columns),
      },
    });
  }

  render() {
    const { elements, detail, ElementPlaceholder } = this.props;

    const elementsMap = _.mapKeys(elements, 'id');

    const AddCellBtn = ({ colDataIndex }) => (
      <Button className={styles.newButton} onClick={() => this.handleAddCell(colDataIndex)}>
        <Icon type="plus" /> 新增
      </Button>
    );

    const designColumns = _.map(detail.columns, (col, colIndex) => ({
      ...col,
      render: (value, record, index) => elementsMap[col.dataIndex]
        ? (
          <div style={{ position: 'relative' }}>
            <SuperAction.ActionsGroup
              overflow
              actions={{
                edit: () => this.props.onEdit(elementsMap[col.dataIndex]),
                remove: () => this.handleRemoveCell(elementsMap[col.dataIndex]),
              }}
            >
              <ElementPlaceholder element={elementsMap[col.dataIndex]} />
            </SuperAction.ActionsGroup>
          </div>
        ) : <AddCellBtn colDataIndex={col.dataIndex} />
    }));

    const rows = [{}];

    return (
      <div>
        <div>
          <ColumnEditableTable
            columns={designColumns}
            dataSource={rows}
            onColumnsChange={this.handleColumnsChange}
            onUpdateColumn={this.handleColumnUpdate}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}
