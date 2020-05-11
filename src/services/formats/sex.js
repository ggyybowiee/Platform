
export default {
  type: 'sex',
  format: (value, { map = { 'M': '男', 'F': '女' } } = {}) => {
    return map[value];
  },
  title: '性别',
  desc: '男女性别',
  config: [{
    field: 'map',
    type: 'map',
    default: { 'M': '男', 'F': '女' },
    title: '字段映射',
    desc: '字段映射，key为编号，value为格式化后的男女',
  }],
};
