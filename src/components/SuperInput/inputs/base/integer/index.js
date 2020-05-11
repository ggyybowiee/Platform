/**
 * Created by Simon on 2017/6/27 0027.
 */
import React from 'react';
import { InputNumber } from 'antd';
import _ from 'lodash';

class Integer extends React.Component {
  // handleChange = v => {
  //   this.props.onChange && this.props.onChange(v ? JSON.parse(v) : null)
  // }

  render() {
    const { value, onChange, ...props } = this.props;
    return (
      <InputNumber  {...props} value={_.isNil(value) || value === '' ? undefined : _.toInteger(value)} onChange={onChange} />
    );
  }
}

Integer.validatorRules = [{ type: 'integer' }];

Integer.properties = {
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

Integer.info = {
  name: '整型',
  category: '数字',
};

Integer.structure = {
  type: 'integer',
};

export default Integer;
