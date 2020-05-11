import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import MessageMenuPane from './MessageMenuPane';

export default {
  header: [{
    scope: 'global',
    position: 'right',
    order: 1,
    comp: <MessageMenuPane key="messages" />,
  }],
};
