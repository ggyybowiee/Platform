import { getApi } from 'utils/request';
import CONFIG from '../config/dictionary';
import _ from 'lodash';

export default {

  namespace: 'dictionary',

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
    *init(action, { call, put }) {
      const resp = yield call(getApi, CONFIG.get('url'));
      const list = _.map(CONFIG.get('getDataFromResp')(resp), item => ({
        code: item[CONFIG.get('codeField')],
        name: item[CONFIG.get('nameField')],
        type: item[CONFIG.get('typeField')],
        abbreviation: item[CONFIG.get('abbreviationField')],
      }));
      yield put({
        type: 'setMap',
        payload: {
          meaningMap: _.chain(list)
            .groupBy('type')
            .mapValues(items => _.chain(items).mapKeys('code').mapValues('name').value())
            .value(),
          map: _.chain(list)
            .groupBy('type')
            .value(),
        },
      })
    },
  },

  reducers: {
    setMap(state, { payload: { map, meaningMap } }) { // eslint-disable-line
      return { ...state, map, meaningMap, inited: true };
    },
  },

};
