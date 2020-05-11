import React from 'react';
import { Icon } from 'antd';

const IconAction = ({ iconType, onTrigger, className }) => (
  <Icon
    className={className}
    type={iconType}
    onClick={onTrigger}
  />
);

IconAction.info = {
  name: '编辑',
};

export default IconAction;
