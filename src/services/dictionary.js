import { getApi } from 'utils/request';

let dicMap;

function init() {
  getApi('/WRMSFoundation/sysDic')
    .then(resp => {
      dicMap = _.mapKeys(resp.queryResult, 'dicType');
    })
}

export default {
  init,
  get(type) {
    return dicMap[type];
  },
}
