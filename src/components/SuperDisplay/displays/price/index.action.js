import React from 'react';
import _ from 'lodash';

const PriceAction = ({ value, ...props }) => (
  <span {...props}>{value}</span>
);

PriceAction.info = {
  name: '价格',
};

PriceAction.test = v => _.isNumber(v);

export default PriceAction;
