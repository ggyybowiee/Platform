import React from 'react';
import _ from 'lodash';
import { Input, Select, AutoComplete } from 'antd';
import classnames from 'classnames';

import styles from './index.less';

const { Option } = Select;

const joinValue = (select, selectValue, inputValue) => {
  if (select.joinValue) {
    return select.joinValue(selectValue, inputValue);
  }
  return select.position === 'after'
    ? `${inputValue || ''}${selectValue || ''}`
    : `${selectValue || ''}${inputValue || ''}`;
};

class TextInput extends React.PureComponent {
  selects = {}

  handleSelectChange = (newSelectValue, changeIndex) => {
    const { addonSelects, onChange } = this.props;
    const inputValue = this.input.props.value;

    const joinedValue = _.reduce(addonSelects, (resultValue, select, index) => {
      const tmpSelectValue = index === changeIndex
        ? newSelectValue
        : this.selects[index].props.value;
      return joinValue(select, tmpSelectValue, resultValue);
    }, inputValue);

    onChange(joinedValue);
  }

  handleInputChange = (evt, type) => {
    const { addonSelects, onChange } = this.props;

    let inputValue = '';

    if (type === 'input') {
      inputValue = evt.target.value || '';
    }

    if (type === 'autoComplete') {
      inputValue = evt || '';
    }

    const joinedValue = _.reduce(addonSelects, (resultValue, select, index) => {
      const tmpSelectValue = this.selects[index].props.value;
      return joinValue(select, tmpSelectValue, resultValue);
    }, inputValue);

    onChange(joinedValue);
  }

  renderSelect(selectProps, value, index) {
    const { options, getSelectValue, getInputValue, className, ...otherProps } = selectProps;
    const inputValue = getInputValue(value, options);
    const selectElt = (
      <Select
        value={getSelectValue && getSelectValue(value, options)}
        onChange={newValue => this.handleSelectChange(newValue, index, selectProps)}
        className={classnames(styles.select, className)}
        {...otherProps}
        ref={c => _.set(this.selects, index, c)}
      >
        {_.map(options, item => (
          <Option value={item.value}>{item.label}</Option>
        ))}
      </Select>
    );

    return {
      inputValue,
      selectElt,
    };
  }

  render() {
    const { addonSelects, value, onChange, autoCompleteDataSource, ...props } = this.props;
    let inputValue = value;
    const addonSelectElts = _.chain(addonSelects)
      .map((selectProps, key) => {
        const {
          inputValue: newInputValue, selectElt,
        } = this.renderSelect(selectProps, inputValue, key);
        inputValue = newInputValue;
        return {
          ...selectProps,
          elt: selectElt,
        };
      })
      .groupBy(item => `addon${_.upperFirst(item.position)}`)
      .mapValues(group => _.map(group, 'elt'))
      .value();

    const options = _.isArray(autoCompleteDataSource) && autoCompleteDataSource.map(item => (
      <Option key={item.value} value={item.value}>
        {item.label}
      </Option>
    ))
    return (
      <span>
        {
          autoCompleteDataSource && autoCompleteDataSource.length > 0 ?
          <AutoComplete
            dataSource={options || []}
            optionLabelProp="value"
            dropdownMatchSelectWidth={false}
            defaultActiveFirstOption={false}
            {...props}
            filterOption={() => false}
            onChange={(e) => this.handleInputChange(e, 'autoComplete')}
            ref={c => _.set(this, 'autoComplete', c)}
          />
          :
          <Input
            {...props}
            value={inputValue}
            {...addonSelectElts}
            onChange={(e) => this.handleInputChange(e, 'input')}
            ref={c => _.set(this, 'input', c)}
          />
        }
      </span>
    );
  }
}

TextInput.getTypeof = (type, validatorRules) => {
  const SpecifyTypeTextInput = (props) => (
    <TextInput {...props} type={type} />
  );
  SpecifyTypeTextInput.validatorRules = validatorRules;
  return SpecifyTypeTextInput;
}

TextInput.properties = {
  autoCompleteDataSource: {
    showName: '提示列表数据源',
    type: 'optionArray',
  },
};

export default TextInput;
