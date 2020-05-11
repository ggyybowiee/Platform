import ModuleConfig from '../services/ModuleConfig';

export default new ModuleConfig('oss', [], {
  url: type => `/sys/sysAttachment/${type}/file`,
  typeField: 'appResourceCode',
  fileField: 'uploadFile',
});
