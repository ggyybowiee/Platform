import React from 'react';
import { Input } from 'antd';

const { TextArea: TextAreaAnt } = Input;

const TextArea = props => <TextAreaAnt {...props} onChange={event => props.onChange(event.target.value)} />;

TextArea.properties = {
  rules: {
    showName: '验证规则',
    type: 'optionArray',
  },
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },
};

TextArea.info = {
  name: '文本域',
  category: '文本',
};

TextArea.structure = {
  type: 'string',
};

export default TextArea;
