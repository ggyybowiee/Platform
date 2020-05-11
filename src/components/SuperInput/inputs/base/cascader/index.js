import React from 'react';
import _ from 'lodash';

import { Cascader as CascaderAnt } from 'antd';

const Cascader = ({ value = [], seperator = '-', ...props }) => {
  const parsedValue = typeof value === 'string' ? value.split(seperator) : value;

  if (!Array.isArray(parsedValue)) {
    console.error('级联选择器的值必须为数组！');

    return null;
  }

  return (
    <CascaderAnt {...props} value={parsedValue} />
  );
};

Cascader.properties = {
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },
  size: {
    showName: '尺寸',
    type: 'enum',
    defaultValue: 'default',
    options: [{
      label: '默认',
      value: 'default',
    }, {
      label: '大',
      value: 'large',
    }, {
      label: '小',
      value: 'small',
    }],
  },
  allowClear: {
    showName: '是否支持清除',
    type: 'boolean',
    defaultValue: true,
  },
  style: {
    showName: '样式',
    type: 'json',
  },
  filedNames: {
    showName: 'options中的字段名',
    type: 'json',
    defaultValue: JSON.stringify({ label: 'label', value: 'value', children: 'children' },  null, '\t'),
  },
};

Cascader.info = {
  name: '级联选择',
  category: '选择',
};

Cascader.structure = {
  type: 'string',
};

export default Cascader;
