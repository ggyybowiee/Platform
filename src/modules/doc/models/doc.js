// import _ from 'lodash';
// import { notification  } from 'antd';
// import { set } from 'lodash/fp';
// import { getApi, postApi, putApi, deleteApi } from 'utils/request';
import createSimpleRestModel from 'utils/createSimpleRestModel';
import CONFIG from '../config';

function getIdField() {
  return CONFIG.get('idField');
}

function getUserDisplayField() {
  return CONFIG.get('displayField');
}

function getRestPath() {
  return CONFIG.get('restPath');
}

export default createSimpleRestModel({
  namespace: 'doc',
  restResourcePath: getRestPath,
  idField: getIdField,
  displayField: getUserDisplayField,
});
