import React from 'react';
import { Row, Col, Card, Icon, Popconfirm, Badge, Tag, Button, Popover } from 'antd';
import SuperAction from 'components/SuperAction';
import { remove } from 'lodash/fp';
import styles from './index.less';

const createNewId = (elements, detail) =>{
  return _.last(elements) ? _.last(elements).id + 1 : 0;
};

export default class InlineLayout extends React.Component {

  handleAdd = () => {
    const { elements, detail, createNewElement, onChange } = this.props;
    if (!onChange) {
      throw new Error('onChange 不是一个函数');
    }
    const newId = createNewId(elements, detail);
    const newElement = createNewElement();
    newElement.id = newId;

    onChange({
      elements: [...elements, newElement ],
    });
  }

  handleRemove = (elt) => {
    const { elements, detail, createNewElement, onChange } = this.props;
    if (!onChange) {
      throw new Error('onChange 不是一个函数');
    }

    onChange({
      elements: remove(elements, elt),
    });
  }

  render() {
    const { elements, ElementPlaceholder } = this.props;

    return (
      <div>
          {
            _.map(elements, (elt) => (
              <SuperAction.ActionsGroup
                key={elt.id}
                className={styles.item}
                overflow
                actions={{
                  edit: () => this.props.onEdit(elt),
                  remove: () => this.handleRemove(elt),
                }}
              >
                <ElementPlaceholder element={elt} />
              </SuperAction.ActionsGroup>
            ))
          }

          <Button type="dashed" className={styles.newButton} onClick={() => this.handleAdd()}>
            <Icon type="plus" /> 新增项
          </Button>
      </div>
    )
  }
}
