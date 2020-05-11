const excludeModules = process.env.PLATFORM_EXCLUDE_MODULES ? process.env.PLATFORM_EXCLUDE_MODULES.split(',') : [];

console.log('===>>>', excludeModules);

if (excludeModules.indexOf('auth') === -1) {
  require('./auth');
}

if (excludeModules.indexOf('permission') === -1) {
  require('./permission');
}

// if (excludeModules.indexOf('hospital') === -1) {
//   require('./hospital');
// }

if (excludeModules.indexOf('system') === -1) {
  require('./system');
}

if (excludeModules.indexOf('tool') === -1) {
  require('./tool');
}

if (excludeModules.indexOf('user') === -1) {
  require('./user');
}

// if (excludeModules.indexOf('message') === -1) {
//   require('./message');
// }

require('./doc');

