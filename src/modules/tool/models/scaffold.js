const {
  utils: {
    request: { getApi, postApi },
  },
} = platform;

export default {
  namespace: 'scaffold',

  state: {
    tpls: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line

      history.listen(({ pathname }) => {
        if (pathname !== '/tool/scaffold') {
          return;
        }

        dispatch({
          type: 'fetchTpls',
        });
      });
    },
  },

  effects: {
    *fetchTpls(action, { call, put }) {
      const resp = yield call(getApi, '/scaffold/tpls');
      yield put({
        type: 'setTpls',
        payload: resp,
      });
    },

    *trigger({ payload: { name, config } }, { call }) {
      yield call(postApi, `/scaffold/${name}`, config);
    },
  },

  reducers: {
    setTpls(state, { payload: tpls }) {
      return { ...state, tpls }
    },
  },
};
