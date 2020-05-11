import ModuleConfig from 'services/ModuleConfig';

export default new ModuleConfig('appSwitchInHeader', {
}, {
  type: 'dropDown',
  valueField: 'resourceCode',
  labelField: 'resourceName',
  iconField: 'resourceIcon',
});
