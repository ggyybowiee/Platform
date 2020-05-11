import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default class SelectTags extends React.Component {
  render() {
    const { options = [], ...props } = this.props;

    return (
      <Select
        mode="tags"
        {...props}
      >
        {
          options.map(option => (
            <Option key={option.value || option}>
              {option.label || option}
            </Option>
          ))
        }
      </Select>
    );
  }
}
