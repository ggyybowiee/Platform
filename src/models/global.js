import rests from '../services/rest';

export default {
  namespace: 'global',

  state: {
    apps: [],
    app: null,
    layout: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      setTimeout(() => {
        platform.event.registerEventType('appSwitch', '切换app');
      }, 0);

      history.listen(({ pathname, search }) => {
        const [, app, layout] = (location.hash.match(/^#\/([^\/]+)\/([^\/]+)\//) || []);
        dispatch({
          type: 'setAppAndLayoutIfNeed',
          payload: { app, layout },
        });
      });
    }
  },

  effects: {
    *fetch({ payload: { name, queryParams } }, { call, put }) {
      const result = yield call(rests[name].list, queryParams);

      yield put({
        type: 'update',
        payload: {
          name,
          data: result || null,
        },
      });

      return result;
    },

    *queryByPost({ payload: { name, data } }, { call, put }) {
      const result = yield call(rests[name].post, data);

      yield put({
        type: 'update',
        payload: {
          name,
          data: result || null,
        },
      });

      return result;
    },

    *post({ payload: { name, data } }, { call }) {
      const result = yield call(rests[name].post, data);

      return result;
    },

    *put({ payload: { name, id, data } }, { call }) {
      const result = yield call(rests[name].put, id, data);

      return result;
    },

    *patch({ payload: { name, data } }, { call }) {
      const result = yield call(rests[name].patch, data);

      return result;
    },

    *remove({ payload: { name, id, data } }, { call }) {
      const result = yield call(rests[name].remove, id, data);

      return result;
    },

    *setAppAndLayoutIfNeed({ payload: { app, layout } }, { select, put }) {
      const currentApp = yield select(state => _.get(state, 'global.app'));
      const currentLayout = yield select(state => _.get(state, 'global.layout'));
      if (currentApp === app && currentLayout === layout) {
        return;
      }
      yield yield put({
        type: 'setAppAndLayout',
        payload: { app, layout },
      });
      yield put({
        type: 'module/refreshCurrentMenu',
      });
      setTimeout(() => {
        platform.event.emmit({ type: 'appSwitch', value: app });
      }, 0);
    },
  },

  reducers: {
    update(state, { payload: { name, data } }) {
      return { ...state, [name]: data, status: data ? 'ok' : 'error' };
    },

    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },

    setApps(state, { payload: apps }) {
      return { ...state, apps };
    },

    setAppAndLayout(state, { payload: { app, layout } }) {
      return {
        ...state,
        app, layout,
      };
    }
  },
};
