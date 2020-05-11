import _ from 'lodash';
import { getApi } from 'utils/request';
import config from '../config';

export default {
  namespace: 'message',

  state: {
    messageTypes: [{
      code: 'notify',
      title: '通知',
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
    }, {
      code: 'message',
      title: '消息',
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
    }, {
      code: 'todo',
      title: '待办',
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
    }],
    messagesMap: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      dispatch({
        type: 'fetchNotices',
      });
    },
  },

  effects: {
    *fetchNotices(action, { call, put }) {
      const data = yield call(getApi, '/notices');
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      // TODO: 调用后端接口清空
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        messagesMap: _.chain(payload)
          .map(config.get('messageTranform') || _.identity)
          .groupBy('code')
          .value(),
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        messagesMap: {
          ...state.messagesMap,
          [payload]: [],
        },
      };
    },
  },
};
