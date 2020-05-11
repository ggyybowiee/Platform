import request from './request';
import { queryObjToStr } from './utils';

export default class Rest {
  constructor(url) {
    this.url = url;
  }

  post = async (payload, options = {}, suffix = '') => {
    return request(`${this.url}${suffix}`, {
      method: 'POST',
      body: payload,
      ...options,
    });
  }

  remove = async (id, options = {}) => {
    return request(`${this.url}/${id}`, {
      method: 'DELETE',
      ...options,
    });
  }

  put = async (id, payload, options) => {
    const suffix = id ? `/${id}` : '';

    return request(`${this.url}${suffix}`, {
      method: 'PUT',
      body: payload,
      ...options,
    });
  }

  patch = async (payload) => {
    return request(this.url, {
      method: 'PATCH',
      body: payload,
    });
  }

  list = async (payload = {}, options = {}, suffix = '') => {
    const queryParamsString = queryObjToStr(payload);

    return request(`${this.url}${suffix}${queryParamsString ? `?${queryParamsString}` : ''}`, {
      ...options,
    });
  }

  item = async (id, options = {}) => {
    const afterFix = id.indexOf('/') === 0 ? id.substr(1, id.length) : id;

    return request(`${this.url}/${afterFix}`, {
      method: 'GET',
      ...options,
    });
  }
}
