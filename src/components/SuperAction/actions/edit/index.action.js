import React from 'react';
import { Icon } from 'antd';

const EditAction = ({ onTrigger, className }) => (
  <Icon
    className={className}
    type="edit"
    onClick={onTrigger}
  />
);

EditAction.info = {
  name: '编辑',
};

export default EditAction;
