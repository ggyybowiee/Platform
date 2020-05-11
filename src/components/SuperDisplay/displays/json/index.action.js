import React from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import ExModal from 'components/ExModal';

const JsonDisplay = ({
  value,
  buttonText = 'Json',
  title = 'Json',
  mode,
  ...props,
}) => mode === 'dialog' ? (
  <Button onClick={() => ExModal.open({
    title,
    content: () => <span {...props}>{JSON.stringify(value)}</span>,
  })}>{buttonText}</Button>
) : <span {...props}>{JSON.stringify(value)}</span>;

JsonDisplay.info = {
  name: 'json',
  priority: 100,

};

JsonDisplay.test = v => {
  // TODO: 优化是否为html代码块判断
  try {
    return _.isObjectLike(JSON.parse(v));
  } catch (err) {
    return false;
  }
};

export default JsonDisplay;
