/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';
import moment from 'moment';

import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

class Date extends React.Component {
  handleChange = (v) => {
    if (this.props.onChange) {
      const stringValue = _.chain(v)
        .map(item => item.format('YYYY-MM-DD HH:mm:ss'))
        .join(',')
        .value();
      this.props.onChange(v ? stringValue : null);
    }
  }

  render() {
    const { value, format, ...otherProps } = this.props;
    const momentValue = value && _.chain(value)
      .split(',')
      .map(str => moment(str))
      .value();

    return (
      <span>
        <RangePicker {...otherProps} value={momentValue} onChange={this.handleChange} format={format} />
      </span>
    );
  }
}

Date.validatorRules = [{
  type: 'date',
}];

Date.properties = {
  dataType: {
    showName: '数据类型',
    type: 'enum',
    defaultValue: 'datetime',
    options: [{
      label: 'datetime',
      value: 'datetime',
    }, {
      label: 'date',
      value: 'date',
    }],
  },
};

Date.properties = {
  dataType: {
    showName: '数据类型',
    type: 'enum',
    defaultValue: 'datetime',
    options: [{
      label: 'datetime',
      value: 'datetime',
    }, {
      label: 'date',
      value: 'date',
    }],
  },
};

Date.info = {
  name: '日期范围',
  category: '时间',
};

Date.validatorRules = [{
  type: 'date',
}];

Date.structure = {
  type: 'array',
};

export default Date;
