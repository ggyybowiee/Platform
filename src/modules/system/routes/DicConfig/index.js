import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Modal } from 'antd';
import _ from 'lodash';
import { createSimpleRestActions } from 'utils/createSimpleRestModel';
import ExModal from 'components/ExModal';
import JsonForm from 'components/JsonForm';
import SuperAction from 'components/SuperAction';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import ITEM_ADD_FORM_CONFIG from './config/itemAddForm';
import DicTypeList from './DicTypeList';
import DicItemList from './DicItemList';
import styles from './index.less';

const getDicTypeListByItems = _.memoize(dicItemList =>
  _.chain(dicItemList)
    .map(item => `${item.dicType}--__--${item.dicTypeName}`)
    .uniq()
    .map(typeStr => ({
      code: typeStr.split('--__--')[0],
      name: typeStr.split('--__--')[1],
    }))
    .value()
);


@connect(({ dicConfig }) => ({
  dicTypeList: mockDicTypeList,
  dicItemList: dicConfig.list,
}))
export default class DicConfigPage extends Component {
  state = {
    selectedTypeCode: null,
    isShowingAddItem: false,
  }

  constructor(props) {
    super(props);

    this.curdHandlers = createSimpleRestActions('dicConfig', props.dispatch);
  }

  componentDidMount() {
    this.curdHandlers.fetchList();
  }

  handleTypeChange = (code) => {
    this.setState({
      selectedTypeCode: code,
    });
  }

  handleUpdateItem = (values, record) => {
    this.curdHandlers.update({ ...record, ...values });
  }

  handleDeleteItem = (record) => {
    this.curdHandlers.delete(record);
  }

  handleAddDicItem = (values) => {
    this.setState({ isShowingAddItem: false });
    this.curdHandlers.create(values);
  }

  handleOpenAddDicItemModal = () => {
    const { dicItemList } = this.props;
    const { selectedTypeCode } = this.state;
    const dicTypeList = getDicTypeListByItems(dicItemList);
    const selectedDicType = _.find(dicTypeList, { code: selectedTypeCode });

    this.setState({
      isShowingAddItem: true,
      addingItem: {
        dicType: selectedDicType.code,
        dicTypeName: selectedDicType.name,
      },
    });
  }

  handleCloseAddDicItemModal = () => {
    this.setState({
      isShowingAddItem: false,
    });
  }

  render() {
    const { selectedTypeCode, addingItem } = this.state;
    const { /* dicTypeList,*/ dicItemList } = this.props;

    const dicTypeList = getDicTypeListByItems(dicItemList);
    const activeDicItemList = _.filter(dicItemList, item => (item.dicType === selectedTypeCode));

    return (
      <PageHeaderLayout title="字典表配置">
        <div>
          <Input.Search
            placeholder="通过字典类型、编码、说明过滤字典类型"
            style={{ width: 300 }}
          />
          <Button onClick={this.handleOpenAddDicItemModal} style={{ float: 'right' }}>新增</Button>
        </div>
        <div className={styles.tablesContainer}>
          <DicTypeList
            dicTypeList={dicTypeList}
            selectedCode={selectedTypeCode}
            onSelect={this.handleTypeChange}
          />
          <DicItemList
            dicItemList={activeDicItemList}
            onUpdate={this.handleUpdateItem}
            onDelete={this.handleDeleteItem}
          />
        </div>
        <Modal title="新增字典项" visible={this.state.isShowingAddItem} footer={false}>
          <JsonForm
            {...ITEM_ADD_FORM_CONFIG}
            data={addingItem}
            onSubmit={this.handleAddDicItem}
            actions={<SuperAction type="button" onTrigger={this.handleCloseAddDicItemModal}>取消</SuperAction>}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}


const mockDicTypeList = [{
  code: '01',
  name: 'a',
}, {
  code: '02',
  name: 'b',
}, {
  code: '03',
  name: 'c',
}, {
  code: '04',
  name: 'd',
}];

const mockDicItemList = [{
  code: '01',
  name: 'a',
  desc: 'aaaaaaaaaaaaaaa',
  type: '01',
}, {
  code: '02',
  name: 'b',
  desc: 'bbbbbbbbbbbbbbb',
  type: '01',
}, {
  code: '03',
  name: 'c',
  desc: 'ccccccccccccccc',
  type: '03',
}, {
  code: '04',
  name: 'd',
  desc: 'ddddddddddddddd',
  type: '03',
}, {
  code: '05',
  name: 'c',
  desc: 'ccccccccccccccc',
  type: '03',
}, {
  code: '06',
  name: 'd',
  desc: 'ddddddddddddddd',
  type: '03',
}, {
  code: '07',
  name: 'c',
  desc: 'ccccccccccccccc',
  type: '03',
}, {
  code: '08',
  name: 'd',
  desc: 'ddddddddddddddd',
  type: '03',
}];
