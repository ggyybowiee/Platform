import { getApi } from 'utils/request';
import _ from 'lodash';

export default {

  namespace: 'ward',

  state: {
    map: {},
    meaningMap: {},
    inited: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      setTimeout(() => {
        if (platform.services.services.platform.store.get('auth.isLogined')) {
          dispatch({ type: 'init' });
        }
        platform.event.subscribe('logined', () => {
          dispatch({ type: 'init' });
        });
      }, 0);
    },
  },

  effects: {
    *init(state, { call, put }) {
      const resp = yield call(getApi, '/WRMSHospital/hosWard');
      yield put({
        type: 'setMap',
        payload: {
          map: _.chain(resp.queryResult)
            .mapKeys('wardCode')
            .value(),
        },
      })
    },
  },

  reducers: {
    setMap(state, { payload: { map } }) { // eslint-disable-line
      return { ...state, map, inited: true };
    },
  },

};
