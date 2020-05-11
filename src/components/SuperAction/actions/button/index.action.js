import React from 'react';
import { Button } from 'antd';

const ButtonAction = ({ onTrigger, ...props }) => (
  <Button {...props} onClick={onTrigger} />
);

ButtonAction.info = {
  name: '编辑',
};

export default ButtonAction;
