const context = require.context('./', true, /\.action\.js$/);
export default _.chain(context.keys())
  .filter(item => item !== './index.js')
  .mapKeys(item => item.match(/\.\/(\w+)\//)[1])
  .mapValues(key => context(key).default)
  .value();
