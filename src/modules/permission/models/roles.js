import createSimpleRestModel from 'utils/createSimpleRestModel';
import { get } from 'lodash/fp';
import CONFIG from '../config';

function getIdField() {
  return CONFIG.get('roles.idField');
}

function getDisplayField() {
  return CONFIG.get('roles.displayField');
}

function getRestPath() {
  return CONFIG.get('roles.restPath');
}

export default createSimpleRestModel({
  resourceName: '角色',
  namespace: 'roles',
  restResourcePath: getRestPath,
  idField: getIdField,
  displayField: getDisplayField,

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line

      dispatch({
        type: 'dept/fetchCurrentRoles',
      });
    },
  },

  effects: {
    *switchRole({ payload: roleCode }, { select, call, put }) {
      const roles = yield select(get('auth.roles'));
      const app = yield select(state => _.get(state, 'global.app'));
      const permissions = yield select(state => _.get(state, 'permissions.currentPermissions'));
      const apps = permissions;
      const currentPermissions = yield select(state => state.permissions.currentPermissions);

      yield put({
        type: 'permissions/fetchCurrentPermissions',
      });

      yield put({
        type: 'auth/setCurrentRole',
        payload: {
          newRole: _.find(roles, { roleCode }),
          app: app || apps[0].code,
          currentPermissions
        },
      });
    },
  },
});
