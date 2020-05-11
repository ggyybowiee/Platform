
export default {
  type: 'boolean',
  format: (value, { map = { 'Y': '是', 'N': '否' } } = {}) => {
    return map[value];
  },
  title: '是否',
  desc: '是否格式',
  config: [{
    field: 'map',
    type: 'map',
    default: { 'Y': '是', 'N': '否' },
    title: '字段映射',
    desc: '字段映射，key为编号，value为格式化后的是否',
  }],
};
