/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';

import {
  Switch,
} from 'antd';

class Custom extends React.Component {
  render() {
    const { Comp } = this.props;

    return (
      <Comp {...this.props} />
    );
  }
}

Custom.properties = {
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
  checkedChildren: {
    showName: '选中时的内容',
    type: 'string',
  },
  unCheckedChildren: {
    showName: '非选中时的内容',
    type: 'string',
  },
};

Custom.info = {
  name: '开关',
  category: '选择',
};

Custom.validatorRules = [{
  type: 'boolean',
}];

Custom.structure = {
  type: 'boolean|string|number',
};

export default Custom;
