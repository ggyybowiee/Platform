import _ from 'lodash';

const context = require.context('./', false, /^((?!(story)).)*\.js$/);
const servicePathes = context
  .keys()
  .filter(item => item !== './index.js');

const platformServices = _.chain(servicePathes)
  .mapKeys(path => path.match(/\.\/(\w+)\.js/)[1])
  .mapValues(path => context(path).default)
  .value();

const services = {
  services: {},
  register(moduleName, moduleServices) {
    this.services[moduleName] = moduleServices;
  },
};

services.register('platform', platformServices);

export default services;
