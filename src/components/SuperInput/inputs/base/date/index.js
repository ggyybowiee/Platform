/**
 * Created by Simon on 2017/6/25 0025.
 */
// import React from 'react';
import moment from 'moment';

import { DatePicker } from 'antd';

class Date extends React.Component {
  handleChange = (v) => {
    if (this.props.onChange) {
      this.props.onChange(v ? moment(v).toDate() : null);
    }
  };

  render() {
    const { value, onChange, format, ...otherProps } = this.props;

    return <DatePicker format={format} {...otherProps} />;
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

export default Date;
