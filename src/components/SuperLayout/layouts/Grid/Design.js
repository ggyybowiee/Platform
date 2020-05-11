import React from 'react';
import { Row, Col, Card, Icon, Popconfirm, Badge, Tag, Button, Popover } from 'antd';
import SuperAction from 'components/SuperAction';
import styles from './index.less';

const createNewId = (elements, detail) =>{
  return _.last(elements) ? _.last(elements).id + 1 : 0;
};

export default class GridLayout extends React.Component {
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
      detail: [ ...detail, [ newId ] ],
    });
  }

  handleAddCell = (rowIndex) => {
    const { elements, detail, createNewElement, onChange } = this.props;
    if (!onChange) {
      throw new Error('onChange 不是一个函数');
    }
    const newId = createNewId(elements, detail);
    const newElement = createNewElement();
    newElement.id = newId;

    const newDetail = [ ...detail ];
    newDetail[rowIndex].push(newId);

    onChange({
      elements: [...elements, newElement ],
      detail: newDetail,
    });
  }

  handleRemoveCell = (rowIndex, keyOrIndex) => {
    const { elements, detail, createNewElement, onChange } = this.props;
    if (!onChange) {
      throw new Error('onChange 不是一个函数');
    }

    const elementToRemove = _.find(elements, { id: keyOrIndex });
    if (!elementToRemove) {
      throw new Error('没有找到需要删除的元素');
    }
    const newElements = [...elements];
    _.remove(newElements, elementToRemove);

    const newDetail = [...detail];
    _.remove(newDetail[rowIndex], itemIndex => (itemIndex === keyOrIndex));

    onChange({
      elements: newElements,
      detail: newDetail,
    });
  }

  render() {
    const { elements, detail, ElementPlaceholder } = this.props;
    const elementsMap = _.mapKeys(elements, 'id');

    return (
      <div>
        <div>
          {_.map(detail, (row, rowIndex) => {
            const span = Math.floor(24 / (row.length + 1));

            return (
              <Row gutter={16} key={`row-${rowIndex}`} className={styles.row}>
                {
                  _.map(row, (keyOrIndex, cellIndex) => (
                    <Col span={span} className={styles.cell} key={keyOrIndex}>
                      <SuperAction.ActionsGroup
                        overflow
                        actions={{
                          edit: () => this.props.onEdit(elementsMap[keyOrIndex], keyOrIndex, rowIndex, cellIndex),
                          remove: () => this.handleRemoveCell(rowIndex, keyOrIndex),
                        }}
                      >
                        <ElementPlaceholder element={elementsMap[keyOrIndex]} />
                      </SuperAction.ActionsGroup>
                    </Col>
                  ))
                }
                <Col span={span} className={styles.extraCell}>
                  <Button type="dashed" className={styles.newButton} onClick={() => this.handleAddCell(rowIndex)}>
                    <Icon type="plus" /> 新增项
                  </Button>
                </Col>
              </Row>
            );
          })}
        </div>

        <div>
          <Button icon="plus" type="primary" onClick={this.handleAddRow}>添加行</Button>
        </div>
      </div>
    )
  }
}
