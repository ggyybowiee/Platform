import Roles from './routes/Roles';
import Permissions from './routes/Permissions';

export default {
  '/permission/roles': { key: 'permission--roles', name: '角色', component: Roles },
  '/permission/permissions': { key: 'permission--permissions', name: '权限', component: Permissions },
};
