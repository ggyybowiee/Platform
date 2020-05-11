import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import qs from 'qs';
import { regsiterHooksType, callHooks } from '../common/hooks';

const authHelper = require('utils/authHelper');

regsiterHooksType('request', {
  name: '请求钩子',
  desc: '执行异步请求时的钩子，可修改请求参数、url等',
  usage: '(url, options) => [newUrl, newOptions]',
});

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response, autoNotifyError, errorMessageVisible) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;

  if (errorMessageVisible) {
    try {
      response.json().then(responseJson => {
        // if (autoNotifyError) {
          notification.error({
            message: `请求错误 ${response.status}: ${response.url}`,
            description: responseJson.message || errortext,
          });
        // }
      }).catch(error => {
        console.error(error);
      });
    } catch (err) {
      console.error(err);
    } finally {
      throw new Error(errortext);
    }
  }
}

export function requestApi(url, options, defaults, autoNotifyError, errorMessageVisible) {
  return request(`/api${url}`, _.defaultsDeep(
    _.defaultsDeep(options, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }),
    defaults
  ), autoNotifyError, errorMessageVisible);
}

export function postApi(url, payload, options, autoNotifyError, errorMessageVisible) {
  return requestApi(url, options, { method: 'POST', body: payload }, autoNotifyError, errorMessageVisible);
}

export function getApi(url, params, options, autoNotifyError, errorMessageVisible) {
  const searchStr = params ? qs.stringify(params, { arrayFormat: 'repeat' }) : '';
  const hasSearchInUrl = url.indexOf('?') > -1;
  const finnalUrl = searchStr ? `${url}${hasSearchInUrl ? '&' : '?'}${searchStr}` : url;
  return requestApi(finnalUrl, options, { method: 'GET' }, autoNotifyError, errorMessageVisible);
}

export function putApi(url, payload, options, autoNotifyError, errorMessageVisible) {
  return requestApi(url, options, { method: 'PUT', body: payload }, autoNotifyError, errorMessageVisible);
}

export function patchApi(url, payload, options, autoNotifyError, errorMessageVisible) {
  return requestApi(url, options, { method: 'PATCH', body: payload }, autoNotifyError, errorMessageVisible);
}

export function deleteApi(url, options, autoNotifyError, errorMessageVisible) {
  return requestApi(url, options, { method: 'DELETE' }, autoNotifyError, errorMessageVisible);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, autoNotifyError, errorMessageVisible) {
  const profile = authHelper.get();
  const isAutoNotifyError = typeof autoNotifyError === 'undefined' ? true : autoNotifyError;
  const isErrorMessageVisible = _.isUndefined(errorMessageVisible) ? true : false;
  const defaultOptions = {
    credentials: 'include',
    Authorization: profile ? profile.jwt : null,
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'PATCH') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
        // 'Content-Type': undefined,
      };
      delete newOptions.headers['Content-Type'];
    }
  }

  console.log('request ===>>', url, autoNotifyError, errorMessageVisible);

  let controller;
  let signal;

  if (window.AbortController) {
    controller = new window.AbortController();
    signal = controller.signal;
  }

  const FETCH_TIMEOUT = 10 * 1000;

  return new Promise((resolve, reject) => {
    let isTimeout = false;

    const timer = setTimeout(() => {
      isTimeout = true;

      if (controller) {
        console.log(url, timer);
        controller.abort();
      }

      clearTimeout(timer);
      notification.destroy();
      notification.error({
        message: '请求超时！',
        description: '',
      });

      resolve({
        err: '请求超时！',
      });
    }, FETCH_TIMEOUT);

    const options = {
      ...newOptions,
      signal,
    };

    callHooks('request', url, options)
      .then(([finnalUrl, finnalOptions]) => {
        fetch(finnalUrl, finnalOptions)
          .then(resopnse => checkStatus(resopnse, isAutoNotifyError, isErrorMessageVisible))
          .then(response => {
            clearTimeout(timer);

            if (!isTimeout) {
              if (options.method === 'DELETE' || response.status === 204) {
                response.text().then(resolve);
              } else {
                  response.json().then(resolve).catch((err) => resolve(null));
              }
            }
          })
          .catch(e => {
            clearTimeout(timer);
            const { dispatch } = platform.app._store;
            const status = e.name;

            if (status === 401) {
              dispatch({
                type: 'auth/logout',
                payload: {
                  redirect: true,
                },
              });
            }
            resolve();
            console.error('调用接口报错，接口：%s', url, 'options: ', options);
          })
      });
  });
}
