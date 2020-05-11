import React from 'react';
import { Popconfirm, Icon } from 'antd';

const ImgDisplay = ({ value, ...props }) => (
  <img src={value} {...props} />
);

ImgDisplay.info = {
  name: '图片',
  priority: 101,
};

ImgDisplay.test = (v) => /^http\:\/\/.*\.(jpg|png|gif|jpeg|bmp)$/.test(v);

export default ImgDisplay;
