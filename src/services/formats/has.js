
export default {
  type: 'has',
  format: (value, { map = { 'Y': '有', 'N': '无' } } = {}) => {
    return map[value];
  },
  title: '有无',
  desc: '有无字典',
  config: [{
    field: 'map',
    type: 'map',
    default: { 'Y': '有', 'N': '无' },
    title: '字段映射',
    desc: '字段映射，key为编号，value为格式化后的有无',
  }],
};
