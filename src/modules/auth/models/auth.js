import { routerRedux } from 'dva/router';
import _ from 'lodash';
import { get, mapValues, first, split } from 'lodash/fp';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { setAuthority } from 'utils/authority';
import { setProfile } from 'utils/profile';
import { reloadAuthorized } from 'utils/Authorized';
import { postApi } from 'utils/request';
import SessionStore from 'utils/SessionStore';
import CONFIG from '../config';
import { putApi, getApi } from '../../../utils/request';

window.Cookie = Cookies;

const authHelper = require('utils/authHelper');

function getSearchParams() {
  return _.chain(location.search && location.search.substr(1))
    .split('&')
    .map(split('='))
    .fromPairs()
    .value();
}

const DEFAULT_STATE = {
  isLogined: false,
  autoLogin: false,
  currentUser: null,
  roles: [],
  currentRole: null,
  jwt: null,
};

function createDefaultState() {
  return authHelper.get() || DEFAULT_STATE;
}

export default {
  namespace: 'auth',

  state: createDefaultState(),

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line

      history.listen(({ pathname }) => {
        // 已登录用户跳转至登录页时，拒绝跳转

        const auth = authHelper.get();
        const isLogined = auth && auth.isLogined;
        const searchParams = getSearchParams();

        if (isLogined && pathname === '/auth/blank/auth/login') {
          if (searchParams.redirect) {
            if (searchParams.redirect.indexOf('login') > -1) {
              dispatch(routerRedux.replace('/'));

              return;
            }

            dispatch(routerRedux.replace(decodeURIComponent(searchParams.redirect)));
            return;
          }
          dispatch(routerRedux.replace('/'));
          // history.goBack();
          return;
        }

        // 检查cookie是否失效，失效则清除登录信息且跳转至登录页
        if (!isLogined && pathname !== '/auth/blank/auth/login') {
          dispatch({
            type: 'logout',
            payload: {
              redirect: true,
            },
          });
        }
      });
    },
  },

  effects: {
    *login({ payload }, { call, put }) {
      const { path, fieldsMap } = CONFIG.get('login');
      const loginInfo = mapValues((field) => payload[field])(fieldsMap);
      let response;
      try {
        response = yield call(postApi, path, loginInfo, undefined, false, false);
      } catch(err) {
        return;
      }

      if (!response || response.code === '404') {
        return {
          message: '用户名或密码错误'
        };
      }

      if (+_.get(response, 'code') > 200) {
        return response;
      }

      yield put({
        type: 'doStuffAfterLogin',
        payload: response,
      });
    },

    *doStuffAfterLogin({ payload }, { put, call }) {
      yield put({
        type: 'setLoginedInfo',
        payload: {
          ...(yield call(getApi, `/auth/users/${payload.userCode}`, null, null, null, false, false)),
          ...payload,
        },
      });

      const searchParams = getSearchParams();

      if (searchParams.redirect) {
        // yield put(routerRedux.replace(decodeURIComponent(searchParams.redirect)));
        const redirect = searchParams.redirect;
        // urlParams.searchParams.delete('redirect');
        yield put(routerRedux.replace(decodeURIComponent(redirect)));
      } else {
        yield put(routerRedux.replace(''));
      }

      platform.event.emmit({ type: 'logined', value: payload });
    },

    *logout({ payload }, { put, select }) {
      try {
        yield put({ type: 'clearLoginedInfo' });
        yield put({ type: 'permissions/clear' });

        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathnameWithSearch = yield select(state => {
          const pathname = state.routing.location.pathname;
          const search = state.routing.location.search;

          if (pathname) {
            return `${pathname}${search || ''}`;
          }

          const match = /\S*#(\/\w*)*/g.exec(window.location.href);

          return match[1];
        });
        // add the parameters in the url
        if (_.get(payload, 'redirect')) {
          urlParams.searchParams.set('redirect', pathnameWithSearch);
          window.history.replaceState(null, 'login', urlParams.href);
        }
      } finally {
        reloadAuthorized();
        yield put(routerRedux.push('/auth/blank/auth/login'));
      }
    },

    *resetPassword({ payload: data }, { select, call }) {
      const userCode = yield select(get('auth.currentUser.userCode'));
      let resp;
      try {
        resp = yield call(putApi, '/auth/updateUserPassword', { ...data, userCode, confirmNewPassword: undefined }, {}, false);
      } catch(err) {
        err.response.json()
          .then((data) => {
            message.error(data.message);
          });
        return;
      }

      if (resp === true) {
        message.success('修改密码成功');
        return;
      }
      // TODO: 错误处理：
      console.log(resp);
    },

    *getCurrentPassword({ payload }, { put, call }) {
      return yield call(getApi, '/auth/passwordCorrect', payload);
    }
  },

  reducers: {
    setLoginedInfo(state, { payload }) {
      const { roles, tokenContent, ...currentUser } = payload;
      const newState = {
        ...state,
        isLogined: true,
        currentUser: CONFIG.get('getUser')(payload),
        roles: CONFIG.get('getRoles')(payload),
        jwt: CONFIG.get('getJwt')(payload),
        currentRole: first(roles),
      };
      SessionStore.setItem('auth', newState);

      if (state.autoLogin) {
        Cookies.set('remember_user_auth', newState, { expires: 1000 * 30 });
      }

      return newState;
    },

    clearLoginedInfo(state) {
      const newState = { ...state, ...DEFAULT_STATE };
      Cookies.remove('remember_user_auth');
      // window.document.cookie = 'remember_user_auth=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      SessionStore.setItem('auth', newState);
      return newState;
    },

    changeLoginStatus(state, { payload: { status, response = {} } }) {
      // 取第一个角色为默认角色
      setAuthority(get([0, 'roleCode'])(response.roles) || null);
      setProfile(response || null);
      return {
        ...state,
        status,
        currentUser: response,
      };
    },

    setCurrentRole(state, { payload: { newRole, app, currentPermissions } }) {
      const newState = { ...state, currentRole: newRole };
      SessionStore.setItem('auth', newState);

      const appPermission = _.find(currentPermissions, { code: app });

      setTimeout(() => {
        location.hash = `#/${app}${appPermission.homePath}`;
      }, 0);

      return newState;
    },

    rememberUserToken(state, { payload: autoLogin }) {
      return {
        ...state,
        autoLogin,
      };
    }
  },
};
