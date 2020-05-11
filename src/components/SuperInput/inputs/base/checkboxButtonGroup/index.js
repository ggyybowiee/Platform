/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import styles from './index.less';

const CheckboxButton = ({ value, options, onChange }) => {
  const handleCheckboxButtonClick = (opt) => {
    const newValue = value ? [...value] : [];
    if (_.includes(newValue, opt.value)) {
      const index = _.findIndex(newValue, item => (item === opt.value));
      newValue.splice(index, 1);
    } else {
      newValue.push(opt.value);
    }
    onChange(newValue);
  };

  return (
    <ul className={styles.checkboxButtonGroup}>
      {
        _.map(options, opt => (
          <li
            className={classnames({ [styles.selected]: _.includes(value, opt.value) })}
            onClick={() => handleCheckboxButtonClick(opt)}>
            {opt.label}
          </li>
        ))
      }
    </ul>
  )
};

CheckboxButton.validatorRules = (type, field) => (field.onlyInOptions ? [{
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
CheckboxButton.properties = {
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

CheckboxButton.info = {
  name: '多选按钮组',
  category: '选择',
};

CheckboxButton.structure = {
  type: 'string',
};

export default CheckboxButton;
