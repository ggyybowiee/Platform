import _ from 'lodash';

const formattersMap = {};

const formatterService = {
  format(type, value, config) {
    const formatter = formattersMap[type];
    if (!formatter) {
      throw new Error(`格式化类型不存在: ${type}`);
    }
    return formatter.format(value, config);
  },
  register(formatter) {
    formattersMap[formatter.type] = formatter;
  },
  get(type) {
    return formattersMap[type];
  },
};

(() => {
  const context = require.context('./formats', false, /\.js$/);
  const formatsPathes = context
    .keys()
    .filter(item => item !== './index.js');

  const formats = _.chain(formatsPathes)
    .mapKeys(path => path.match(/\.\/(\w+)\.js/)[1])
    .mapValues(path => context(path).default)
    .value();

  _.forEach(formats, formatterService.register);
})();

formatterService.formatters = formattersMap;

export default formatterService;
