import React from 'react';
import AppSwitch from './AppSwitch';

export default {
  header: [{
    name: '应用切换',
    scope: 'global',
    position: 'left',
    order: -3,
    comp: <AppSwitch key="switch-app" icon="appstore" />,
  }],
};
