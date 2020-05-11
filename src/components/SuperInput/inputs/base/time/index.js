import React from 'react';
import moment from 'moment';

import { TimePicker } from 'antd';

class Time extends React.Component {
  handleChange = (v) => {
    if (this.props.onChange) {
      this.props.onChange(v ? moment(v).toDate() : null);
    }
  };

  render() {
    const { value, format } = this.props;

    return <TimePicker value={value ? moment(value) : ''} onChange={this.handleChange} format={format} />;
  }
}

Time.properties = {
  use12Hours: {
    showName: '使用12小时制',
    type: 'boolean',
  },
  minuteStep: {
    defaultValue: true,
    showName: '分钟选项间隔',
    type: 'integer',
  },
  format: {
    showName: '日期格式',
    type: 'string',
    defaultValue: 'YYYY-MM-DD HH:mm:ss',
  },
};

Time.validatorRules = [{
  type: 'Time',
}];

Time.info = {
  name: '仅时间',
  category: '时间',
};

Time.structure = {
  type: 'string',
};


export default Time;
