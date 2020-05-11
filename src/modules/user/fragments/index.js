import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import UserMenuFragment from './UserMenu';

export default {
  header: [{
    scope: 'global',
    position: 'right',
    comp: <UserMenuFragment key="header" />,
  }],
};
