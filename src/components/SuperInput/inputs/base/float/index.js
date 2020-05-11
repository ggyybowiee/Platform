import React from 'react';
import { InputNumber } from 'antd';

const Float = props => <InputNumber {...props} />;
Float.info = {
  name: '浮点数字',
  category: '数字',
};

Float.structure = {
  type: 'float',
};

Float.properties = {
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },
  max: {
    showName: '最大值',
    type: 'string',
  },
  min: {
    showName: '最小值',
    type: 'string',
  },
  suffix: {
    showName: '后缀',
    type: 'string',
    isRequired: false,
  },
};

export default Float;
