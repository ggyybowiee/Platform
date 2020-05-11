/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import styles from './index.less';

import {
  Select as SelectAnt,
  Checkbox as CheckboxAnt,
} from 'antd';

const { Option, OptGroup } = SelectAnt;
const CheckboxGroup = CheckboxAnt.Group;

const Select = ({ options, optionGroups, size = 'default', ...otherProps }) => (
  <SelectAnt size={size} mode="tags" {...otherProps}>
    {
      optionGroups
        ? _.map(optionGroups, ({ title, options }, index) => (
          <OptGroup label={title} key={index}>
            {
              _.map(options, ({ label, value }, index) => (
                <Option value={value} index={index}>{label}</Option>
              ))
            }
          </OptGroup>
        ))
        : _.map(options, ({ label, value }, index) => (
          <Option value={value} key={index}>
            {label}
          </Option>
        ))
    }
  </SelectAnt>
);


// TODO: 是否支持props.optionGroups?
const Checkbox = ({ options, ...otherProps }) => (
  <CheckboxGroup  options={options} {...otherProps} />
);

const selectComponent = {
  checkbox: props => <Checkbox {...props} />,
  select: props => <Select {...props} />,
};

const SelectInput = ({ selectType = 'select', ...props }) => selectComponent[selectType](props);

SelectInput.validatorRules = (type, field) => (field.onlyInOptions ? [{
  type: 'array',
}, {
  validator(rule, value, callback) {
    const notInOptions = _.filter(
      value,
      item => _.every(field.options, opt => !_.isEqual(opt.value, item))
    );
    if (notInOptions && notInOptions.length) {
      callback([`没有以下的选项：${_.isArray(value) ? notInOptions : value}`]);
      return;
    }
    callback([]);
  },
}] : [{
  type: 'array',
}]);


// TODO: 添加mode属性配置，对应antd的select组件的mode
SelectInput.properties = {
  selectType: {
    showName: '多选类型',
    type: 'enum',
    defaultValue: 'select',
    options: [{
      label: '下拉框',
      value: 'select',
    }, {
      label: '复选框',
      value: 'checkbox',
    }],
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
  options: {
    showName: '选项',
    type: 'optionArray',
    fields: [{
      field: 'label',
      type: 'string',
      showName: '标签',
    }, {
      field: 'value',
      type: 'string',
      showName: '值',
    }],
    isRequired: false,
  },
};

SelectInput.info = {
  name: '多选',
  category: '选择',
};

SelectInput.structure = {
  type: 'string',
};

export default SelectInput;
