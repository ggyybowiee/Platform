
export default {
  type: 'address',
  format: (value, { seperator = '-' }) => {
    if (typeof value !== 'string') {
      return [];
    }

    return value.split(seperator);
  },
  title: '地址格式化',
  desc: '由字符串转成数组',
  config: [{
    field: 'seperator',
    type: 'string',
    default: '-',
    title: '分隔符',
    desc: '分割字符串',
  }],
};
