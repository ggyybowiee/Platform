const {
  utils: {
    request: { getApi, postApi, deleteApi },
  },
} = platform;

export default {
  namespace: 'icons',

  state: {
    icons: [],
  },

  effects: {
    *fetchIconTypes(action, { call, put }) {
      const response = yield call(getApi, '/icons/iconTypes');
      yield put({
        type: 'setIconTypes',
        payload: response,
      });
    },

    *run(action, { call }) {
      return yield call(getApi, '/icons/run');
    },

    *delete({ payload }, { call }) {
      return yield call(deleteApi, `/icons/delete/${payload}`);
    },
  },

  reducers: {
    setIconTypes(state, { payload: iconTypes }) {
      return { ...state, iconTypes }
    },
  },
};
