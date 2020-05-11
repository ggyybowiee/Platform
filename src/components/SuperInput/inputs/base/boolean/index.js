/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';

import {
  Switch,
} from 'antd';

class BooleanInput extends React.Component {
  handleChange = (value) => {
    const { valueMap, onChange } = this.props;
    if (!valueMap) {
      onChange(value);
      return;
    }
    onChange(valueMap[value.toString()]);
  }

  render() {
    const {
      value,
      valueMap,
      onChange,
      checkedChildren = '是',
      unCheckedChildren = '否',
      ...props
    } = this.props;

    let checked = value;

    if (valueMap) {
      const checkedStr = _.findKey(valueMap, mapValue => (mapValue === value));
      checked = checkedStr ? JSON.parse(checkedStr) : null;
    }

    return (
      <Switch
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
        checked={checked}
        onChange={this.handleChange}
        defaultChecked={props.defaultValue}
        {...props}
      />
    );
  }
}

BooleanInput.properties = {
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
    showName: '选中时的显示文本',
    type: 'string',
  },
  unCheckedChildren: {
    showName: '非选中时的显示文本',
    type: 'string',
  },
  checkedValue: {
    showName: '选中时的值',
    type: 'string',
  },
  unCheckedValue: {
    showName: '非选中时的值',
    type: 'string',
  },
};

BooleanInput.info = {
  name: '开关',
  category: '选择',
};

BooleanInput.validatorRules = [{
  type: 'boolean',
}];

BooleanInput.structure = {
  type: 'boolean|string|number',
};

export default BooleanInput;
