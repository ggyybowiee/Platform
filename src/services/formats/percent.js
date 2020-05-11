
export default {
  type: 'percent',
  format: (value, { scale = 100, precision = 2, showUnit = true } = {}) => {
    return `${_.round(value * scale, precision)}${showUnit ? '%' : ''}`;
  },
  title: '百分比',
  desc: '百分比格式',
  config: [{
    field: 'scale',
    type: 'number',
    default: 100,
    title: '伸缩比例',
    desc: '伸缩比例，value将乘以该值',
  }, {
    field: 'showUnit',
    type: 'boolean',
    default: true,
    title: '是否显示单位',
    desc: '是否显示单位',
  }],
};
