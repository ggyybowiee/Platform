/**
 * Created by Simon on 2017/6/27 0027.
 */
import React from 'react';
import { Input, Select } from 'antd';
import _ from 'lodash';

const InputGroup = Input.Group;
const { Option } = Select;

class RegExpType extends React.Component {
  handleChange = v => {
    const { value } = this.props;
    const newValue = {
      ...value,
      pattern: v,
    };

    this.props.onChange && this.props.onChange(newValue)
  }

  handleFlagChange = (flags) => {
    const { value } = this.props;

    const newValue = {
      ...value,
      flags: flags.join(''),
    };

    this.props.onChange(newValue);
  }

  render() {
    const { value, onChange } = this.props;
    return (
      <InputGroup
        compact
        style={{ width: '100%' }}
      >
        <Input
          value={value ? value.pattern : ''}
          onChange={(e) => this.handleChange(e.target.value)}
          style={{ width: '50%' }}
        />
        <Select mode="tags" onChange={this.handleFlagChange} defaultValue={value ? _.split(value.flags, '') : ['g']}>
          <Option value="i">i</Option>
          <Option value="g">g</Option>
          <Option value="m">m</Option>
          <Option value="u">u</Option>
          <Option value="y">y</Option>
        </Select>
      </InputGroup>
    );
  }
}

RegExpType.validatorRules = [{ type: 'regExp' }];

RegExpType.properties = {
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },
};

RegExpType.info = {
  name: '正则表达式',
  category: '正则',
};

RegExpType.structure = {
  type: 'object',
};

export default RegExpType;
