import React from 'react';
import { Popconfirm, Icon } from 'antd';

const RemoveAction = ({ className, onTrigger }) => (
  <Popconfirm title="确认删除此项？" onConfirm={onTrigger}>
    <Icon
      className={className}
      style={{ color: '#f5222d' }}
      type="close"
    />
  </Popconfirm>
);

RemoveAction.info = {
  name: '删除',
};

export default RemoveAction;
