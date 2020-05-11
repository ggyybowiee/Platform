const MAP = {
  '0': '模块资源',
  '1': '实体资源',
  '2': '应用资源',
};

export default [
  {
    type: 'permission-resource-type',
    format(v) {
      return MAP[v];
    },
  },
];
