import React from 'react';
import GrantUserRole from './GrantUserRole';
import RoleSwitch from './RoleSwitch';

export default {
  header: [{
    name: '角色切换',
    scope: 'global',
    position: 'right',
    order: -1,
    comp: <RoleSwitch key="switch-user-role" icon="trademark" valueField="roleCode" labelField="roleName" />,
  }],
  'user-list-rowActions': [{
    scope: 'global',
    Comp: ({ item: user }) => <GrantUserRole key="grant-user-role" user={user} />,
  }],
};
