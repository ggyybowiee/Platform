import _ from 'lodash';
import { notification  } from 'antd';
import { set } from 'lodash/fp';
import qs from 'qs';
import { getApi, postApi, putApi, deleteApi } from 'utils/request';
window.qs = qs;

export const createSimpleRestActions = (namespace, dispatch, converter) => ({
  create: item => dispatch({
    type: `${namespace}/createItem`,
    payload: item,
  }),
  update: item => dispatch({
    type: `${namespace}/updateItem`,
    payload: item,
  }),
  fetchList: (query) => dispatch({
    type: `${namespace}/fetchList`,
    payload: query,
  }),
  fetchPaginationList: (query) => dispatch({
    type: `${namespace}/fetchPaginationList`,
    payload: query,
  }),
  delete: item => dispatch({
    type: `${namespace}/deleteItem`,
    payload: item,
  }),
});

export default ({
  resourceName,
  namespace, initialState = {}, effects = {}, reducers = {}, subscriptions,
  paginationPath,
  restResourcePath, idField: idFieldConfig = 'id', displayField: displayFieldConfig = 'id',
  getUrls,

  resolves,
  beforeCreate,
  beforeUpdate,
}) => {
  const getIdField = _.isFunction(idFieldConfig) ? idFieldConfig : () => idFieldConfig;
  const getDisplayField = _.isFunction(displayFieldConfig) ? displayFieldConfig : () => displayFieldConfig;
  const getRestPath = _.isFunction(restResourcePath) ? restResourcePath : () => restResourcePath;
  const getPaginationPath = _.isFunction(paginationPath) ? paginationPath : () => (paginationPath || restResourcePath);
  let getUrlsMap;
  if (restResourcePath) {
    getUrlsMap = {
      getFetchListUrl: getRestPath,
      getFetchPaginationListUrl: getPaginationPath,
      getUpdateUrl: (item) => `${getRestPath()}/${item[getIdField()]}`,
      getCreateUrl: getRestPath,
      getDeleteUrl: (item) => `${getRestPath()}/${item[getIdField()]}`,
    };
  } else {
    getUrlsMap = {
      getFetchListUrl: (params) => getUrls('fetchList', params),
      getFetchPaginationListUrl: () => getUrls('fetchPaginationList'),
      getUpdateUrl: (item) => getUrls('update', item),
      getCreateUrl: (params) => getUrls('create', params),
      getDeleteUrl: (item) => getUrls('delete', item),
    };
  }
  const {
    getFetchListUrl,
    getFetchPaginationListUrl,
    getUpdateUrl,
    getCreateUrl,
    getDeleteUrl,
  } = getUrlsMap;

  return {
    namespace,

    state: {
      list: [],
      queryType: null,
      queryParams: {},
      ...initialState,
    },

    subscriptions: {
      setup(props) {  // eslint-disable-line
        if (subscriptions && subscriptions.setup) {
          subscriptions.setup(props);
        }
      },
    },

    effects: {
      *refreshList({ payload }, { select, call, put }) {
        const { queryType, queryParams } = yield select(state => _.get(state, [namespace]));
        if (!queryType) {
          console.error('刷新列表错误，上一次查询类型queryType是空的，可能由于未先调用fetchPaginationList/fetchList');
          return;
        }
        yield put({
          type: queryType,
          payload: queryParams,
        });
      },

      *fetchPaginationList({ type, payload }, { call, put }) {
        const pagination = {
          current: payload.currentPage || 1,
          pageSize: payload.pageSize || 10,
        };
        const params = {
          ...(payload || {}),
          countAll: true,
          offset: pagination.pageSize * (pagination.current - 1),
          num: pagination.pageSize,
          currentPage: undefined,
          pageSize: undefined,
        };

        const filteredParams = _.chain(params)
          .toPairs()
          .filter(([key, value]) =>
            !_.isNil(value)
            && value !== ''
            && (!_.isArray(value) || value.length !== 0))
          .fromPairs()
          .value();

        let response;
        try {
          response = yield call(getApi, getFetchPaginationListUrl(filteredParams), filteredParams);
        } catch(err)  {
          return;
        }

        const data = resolves && resolves.fetchPaginationList ? resolves.fetchPaginationList(response, pagination) : {
          list: _.get(response, 'queryResult'),
          pagination: { ...pagination, total: _.get(response, 'totalCnt') },
        };

        yield put({
          type: 'setPaginationList',
          payload: data,
          queryParams: params,
          queryType: 'fetchPaginationList',
        });

        return {
          type,
          response,
        };
      },

      *fetchList({ type, payload }, { call, put }) {
        let response;
        try {
          response = yield call(getApi, getFetchListUrl(payload), payload);
        } catch (err) {
          return;
        }
        let list = response;
        let extraState = {};

        if (resolves && resolves.fetchList) {
          const resolvedResult = resolves.fetchList(response);
          list = resolvedResult.list;
          extraState = { ...resolvedResult };
          delete extraState.list;
          // count = resolvedResult.count;
        }

        yield put({
          type: 'setList',
          payload: list,
          queryParams: payload,
          queryType: 'fetchList',
          extraState,
        });

        return {
          type,
          response,
        };
      },

      *deleteItem({ type, payload: item }, { call, put }) {
        let response;
        try {
          response = yield call(deleteApi, getDeleteUrl(item));
        } catch(err) {
          return;
        }

        yield put({
          type: 'removeItem',
          payload: response || item,
        });

        notification.success({
          message: '成功',
          description: `删除${resourceName || ''} "${item[getDisplayField()]}" 成功`,
        });

        return {
          type,
          response: response || item,
        };
      },

      *updateItem({ type, payload: item }, { select, call, put }) {
        const postData = beforeUpdate ? (yield beforeUpdate(item, { select })) : item;
        let response;
        try {
          response = yield call(putApi, getUpdateUrl(item), postData);
        } catch (err) {
          return;
        }

        yield put({
          type: 'setItem',
          payload: response || item,
        });

        notification.success({
          message: '修改成功',
          description: `修改${resourceName || ''} "${item[getDisplayField()]}" 信息成功`,
        });

        return {
          type,
          response,
        };
      },

      *createItem({ type, payload: item }, { select, call, put }) {
        const postData = beforeCreate ? (yield beforeCreate(item, { select })) : item;
        let response;
        try {
          response = yield call(postApi, getCreateUrl(), postData);
        } catch(err) {
          return;
        }

        if (!_.isNil(response)) {
          yield put({
            type: 'addItem',
            payload: response,
          });

          notification.success({
            message: '创建成功',
            description: `创建${resourceName || ''} "${item[getDisplayField()]}" 信息成功`,
          });
        }

        return {
          type,
          response,
        };
      },

      ...effects,
    },

    reducers: {
      setPaginationList(state, { payload, queryParams, queryType }) {
        return { ...state, queryParams, queryType, ...payload };
      },

      setList(state, { payload: list, extraState, queryParams, queryType }) {
        return { ...state, queryParams, queryType, list, ...extraState };
      },

      removeItem(state, { payload: item }) {
        const idField = getIdField();
        return {
          ...state,
          list: _.reject(state.list, { [idField]: item[idField] }),
        };
      },

      setItem(state, { payload: item }) {
        const idField = getIdField();
        const index = _.findIndex(state.list, { [idField]: item[idField] });

        return {
          ...state,
          list: set(index)(item)(state.list),
        }
      },

      addItem(state, { payload: item }) {
        return {
          ...state,
          list: state.list.concat([item]),
        }
      },

      cleanList(state) {
        return {
          ...state,
          list: [],
        };
      },

      ...reducers,
    },
  };
}
