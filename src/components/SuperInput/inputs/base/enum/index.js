/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';
import _ from 'lodash';

import {
  Radio,
  Select,
} from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { Option: SelectOption, OptGroup: SelectOptGroup } = Select;

const enumComponent = {
  radio: props => <Radios {...props} />,
  button: props => <RadioEnum {...props} />,
  select: props => <SelectEnum {...props} />,
};

// TODO: 是否支持props.optionGroups?
const Radios = ({ options, ...otherProps }) => (
  <RadioGroup {...otherProps} value={_.isUndefined(otherProps.value) ? otherProps.defaultValue : otherProps.value}>
    {
      _.map(options, ({ label, value }) => (
        <Radio value={value}>
          {label}
        </Radio>
      ))
    }
  </RadioGroup>
);

// TODO: 是否支持props.optionGroups?
const RadioEnum = ({ options, size = 'default', ...otherProps }) => (
  <RadioGroup size={size} {...otherProps}>
    {
      _.map(options, ({ label, value }) => (
        <RadioButton value={value}>
          {label}
        </RadioButton>
      ))
    }
  </RadioGroup>
);

const SelectEnum = ({ optionGroups, options, size = 'default', ...otherProps }) => (
  <Select size={size} {...otherProps}>
    {
      optionGroups
        ? _.map(optionGroups, ({ title, options }, index) => (
          <SelectOptGroup label={title} key={index}>
            {
              _.map(options, ({ label, value }, index) => (
                <SelectOption value={value} index={index}>{label}</SelectOption>
              ))
            }
          </SelectOptGroup>
        ))
        : _.map(options, ({ label, value }, index) => (
          <SelectOption value={value} key={index}>
            {label}
          </SelectOption>
        ))
    }
  </Select>
);

const Enum = ({ enumType = 'radio', ...props }) => enumComponent[enumType](props);

Enum.validatorRules = (type, field) => [{
  type: 'enum',
  enum: _.map(field.options, 'value'),
  message: `必须是以下其中一个：${_.map(field.options, 'label')}`,
}];

Enum.properties = {
  enumType: {
    showName: '单选类型',
    type: 'enum',
    defaultValue: 'radio',
    options: [{
      label: '按钮式',
      value: 'button',
    }, {
      label: '单选框',
      value: 'radio',
    }, {
      label: '下拉框',
      value: 'select',
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

Enum.info = {
  name: '枚举',
  category: '选择',
};

Enum.structure = {
  type: 'string',
};

export default Enum;
