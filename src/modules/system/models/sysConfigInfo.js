import createSimpleRestModel from 'utils/createSimpleRestModel';

export default createSimpleRestModel({
  namespace: 'sysConfigInfo',
  restResourcePath: '/sys/sysConfig',
  idField: 'configCode',
  displayField: 'configDesc',
});
