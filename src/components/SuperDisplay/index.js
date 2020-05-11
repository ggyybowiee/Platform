import React from 'react';
import displays from './displays';

const SuperDisplay = ({ type, onTrigger, ...otherProps }) => {
  const Display = displays[type];
  if (!Display) {
    return <span style={{ color: 'red' }}>不支持的super类型</span>;
  }

  return (
    <Display {...otherProps} />
  );
};

const auto = ({ value, OtherwiseDisplay, ...params }) => {
  const Display = _.chain(displays)
    .values()
    .orderBy('info.priority')
    .find(display => {
      return display.test(value);
    }).value() || OtherwiseDisplay;

  if (!Display) {
    return <span>不支持的super类型</span>
  }

  return <Display value={value} {...params} />
}

SuperDisplay.displays = {
  ...displays,
  auto,
};

export default SuperDisplay;
