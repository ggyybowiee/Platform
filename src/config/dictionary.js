import ModuleConfig from '../services/ModuleConfig';
import _ from 'lodash';

export default new ModuleConfig('dictionary', [], {
  url: '/sys/sysDic',
  codeField: 'dicCode',
  nameField: 'dicName',
  typeField: 'dicType',
  abbreviationField: 'abbreviation',
  getDataFromResp: resp => _.get(resp, 'queryResult'),
});
