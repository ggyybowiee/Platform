// import _ from 'lodash';
// import { notification  } from 'antd';
// import { set } from 'lodash/fp';
// import { getApi, postApi, putApi, deleteApi } from 'utils/request';
import createSimpleRestModel from 'utils/createSimpleRestModel';
import CONFIG from '../config';

function getIdField() {
  return CONFIG.get('idField');
}

function getUserNameField() {
  return CONFIG.get('userNameField');
}

function getPaginationPath() {
  return CONFIG.get('restPath');
}

function getRestPath() {
  return CONFIG.get('restPath').replace('/page', '');
}

export default createSimpleRestModel({
  namespace: 'user',
  restResourcePath: getRestPath,
  paginationPath: getPaginationPath,
  idField: getIdField,
  displayField: getUserNameField,
});
