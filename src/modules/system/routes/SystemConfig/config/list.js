export default {
  columns: [{
    title: '系统',
    key: 'system',
    dataIndex: 'system',
  }, {
    title: '编码',
    key: 'code',
    dataIndex: 'configCode',
  }, {
    title: '类型',
    key: 'type',
    dataIndex: 'configType',
  }, {
    title: '值',
    key: 'value',
    dataIndex: 'configValue',
    width: '20%'
  }, {
    title: '启用',
    key: 'isOpen',
    dataIndex: 'status',
    formatter: {
      type: 'boolean',
      map: { '01': '是', '02': '否' },
    }
  }, {
    title: '默认值',
    key: 'configDefaultValue',
    dataIndex: 'configDefaultValue',
    width: '20%'
  },{
    title: '描述',
    key: 'desc',
    dataIndex: 'configDesc',
    width: '20%'
  }],
};
