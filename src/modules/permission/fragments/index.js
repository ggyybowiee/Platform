import React from 'react';
import CONFIG from '../config';
import GrantUserRole from './GrantUserRole';
import RoleSwitch from './RoleSwitch';

const header = [];

if (CONFIG.get('showRoleSwitch')) {
  header.push({
    name: '角色切换',
    scope: 'global',
    position: 'right',
    order: -1,
    comp: <RoleSwitch key="switch-user-role" icon="trademark" valueField="roleCode" labelField="roleName" />,
  });
}

export default {
  header,
  'user-list-rowActions': [{
    scope: 'global',
    Comp: ({ item: user }) => <GrantUserRole key="grant-user-role" user={user} />,
  }],
};
