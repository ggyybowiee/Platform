import moment from 'moment';

export default {
  type: 'date',
  format: (value, { style = 'YYYY-MM-DD HH:mm:ss' } = {}) => {
    if (!value) {
      return '';
    }
    return moment(value).format(style);
  },
  title: '日期',
  desc: '格式化日期',
  config: [{
    field: 'style',
    type: 'string',
    default: 'YYYY-MM-DD HH:mm:ss',
    title: '格式化样式',
    desc: '日期格式化样式，YYYY代表年，MM代表月，DD代表日，HH代表小时，mm代表分，ss代表秒，其他请参考moment.js',
  }],
};
