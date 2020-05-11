import qs from 'qs';
import _ from 'lodash';
import createSimpleRestModel from 'utils/createSimpleRestModel';
import { first } from 'lodash/fp';
import { getApi } from 'utils/request';
import getAccessibleApps from 'utils/getAccessibleApps';
import CONFIG from '../config';
import { fetchResourcesByRole } from '../services/permissions.ts';
// import { fetchResourcesByRole, fetchAllResourcePermisions } from '../services/permissionsV2.ts';

function getIdField() {
  return CONFIG.get('permissions.idField');
}

function getDisplayField() {
  return CONFIG.get('permissions.displayField');
}

function getRestPath() {
  return CONFIG.get('permissions.restPath');
}

function getUserPermissionsRestPath() {
  let userPermissionsPath = CONFIG.get('userPermissions.userAppPath');
  if (_.isFunction(userPermissionsPath)) {
    userPermissionsPath = userPermissionsPath();
  }
  return userPermissionsPath;
}

export default createSimpleRestModel({
  resourceName: '权限',
  namespace: 'permissions',
  restResourcePath: getRestPath,
  idField: getIdField,
  displayField: getDisplayField,

  state: {
    resourcePermissions: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      setTimeout(() => {
        dispatch({ type: 'watchLoginStatus' });
      }, 0);
    },
  },

  effects: {
    // *fetchList(action, { select, put, call }) {
    //   const resp = yield call(fetchAllResourcePermisions);
    //   yield put({
    //     type: 'setResourcePermissions',
    //     payload: resp,
    //   });
    // },

    *watchLoginStatus(action, { select, put, call, take }) {
      while (true) {
        const isLogined = yield select(state => _.get(state, 'auth.isLogined'));

        if (!isLogined) {
          yield take('auth/setLoginedInfo');

          continue
        }

        yield (yield put({
          type: 'fetchCurrentPermissions',
        }));

        // const app = yield select(state => _.get(state, 'global.app'));
        const permissions = yield select(state => _.get(state, 'permissions.currentPermissions'));
        const apps = permissions;

        yield new Promise(resolve => setTimeout(resolve, 0));
        yield put({
          type: 'global/setApps',
          payload: apps,
        });

        const loadedModules = yield select(state => _.get(state, 'module.loadedModules'));
        const accessibleApp = getAccessibleApps(apps, loadedModules);

        yield put({
          type: 'setAccessibleApp',
          payload: accessibleApp,
        });

        if (accessibleApp && ['#', '#/'].indexOf(location.hash) > -1) {
          // 不包含在loadedModules的app不跳转，比如药柜柜机端程序
          yield put({
            type: 'switchApp',
            payload: accessibleApp,
          });
        }

        yield take('auth/setLoginedInfo');
      }
    },

    *fetchCurrentPermissions(action, { select, put, call }) {
      const resp = yield call(fetchResourcesByRole, yield select(state => _.get(state, 'auth.currentRole.roleCode')));
      yield (yield put({
        type: 'setCurrentPermissions',
        payload: resp.apps,
      }));

      yield put({
        type: 'global/setApps',
        payload: resp.apps,
      });

      yield put({
        type: 'module/refreshCurrentMenu',
      });
    },

    *switchApp({ payload: app }, { select, put, call }) {
      location.hash = `#/${app.code}${app.homePath}`;
    },
  },

  reducers: {
    setCurrentPermissions(state, { payload }) {
      window.platform.event.emmit({ type: 'currentPermissions', value: payload });

      return { ...state, currentPermissions: payload };
    },
    setResourcePermissions(state, { payload }) {
      return { ...state, resourcePermissions: payload };
    },
    setAccessibleApp(state, { payload }) {
      return { ...state, accessibleApp: payload };
    },

    clear() {
      return {
        resourcePermissions: {},
      };
    },
  },
});
