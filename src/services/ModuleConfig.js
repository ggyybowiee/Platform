import _ from 'lodash';

export default class ModuleConfig {
  constructor(moduleName, configSchema, defaultConfig) {
    this.schema = configSchema;
    this.config = _.defaults(_.get(window, ['moduleConfig', moduleName]) || {}, defaultConfig);
    if (!platform.moduleConfigs) {
      platform.moduleConfigs = {};
    }
    platform.moduleConfigs[moduleName] = this;
  }

  get(configKey) {
    return _.get(this.config, configKey);
  }

  set(configKey, value) {
    _.set(this.config, configKey, value);
  }
}
