import _ from 'lodash';

export default {
  get(path) {
    return _.get(platform.app._store.getState(), path);
  },
};
