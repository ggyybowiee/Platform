import React from 'react';
import { Icon } from 'antd';

const TextDisplay = ({ value }) => {
  if (_.isObjectLike(value)) {
    debugger;
    return <div>{JSON.stringify(value)}</div>;
  }

  return (
    <div>{value}</div>
  );
};

TextDisplay.info = {
  name: 'html块',
};

TextDisplay.test = v => {
  return _.isString(v);
};

export default TextDisplay;
