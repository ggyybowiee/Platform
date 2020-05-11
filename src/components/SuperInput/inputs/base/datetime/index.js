/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';
import moment from 'moment';

import {
  DatePicker,
} from 'antd';

class Date extends React.Component {
  handleChange = (v) => {
    if (this.props.onChange) {
      this.props.onChange(v ? moment(v).toDate() : null);
    }
  }

  render() {
    const {
      value,
      disabledTime,
      format,
      showTime,
      ...otherProps
    } = this.props;

    return (
      <DatePicker
        {...otherProps}
        showTime={showTime}
        value={value ? moment(value) : ''}
        disabledTime={disabledTime}
        format={format}
        onChange={this.handleChange}
      />
    );
  }
}

Date.properties = {
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },
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
  format: {
    showName: '日期格式',
    type: 'string',
    defaultValue: 'YYYY-MM-DD HH:mm:ss',
  },
  showTime: {
    defaultValue: true,
    showName: '可选择时间',
    type: 'boolean',
  },
};

Date.info = {
  name: '日期（+时间）',
  category: '时间',
};

Date.validatorRules = [{
  type: 'date',
}];

Date.structure = {
  type: 'string',
};

export default Date;
