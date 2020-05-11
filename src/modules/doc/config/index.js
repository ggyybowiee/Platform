import ModuleConfig from 'services/ModuleConfig';

export default new ModuleConfig('doc', {
  // 配置描述
}, {
  // 默认配置
  idField: 'userCode',
  userNameField: 'userName',
  restPath: '/auth/users',
  list: {
    columns: [{
      title: '用户编号',
      dataIndex: 'userCode',
      key: 'userCode',
    }, {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      formatter: {
        type: 'date',
        style: 'YYYY-MM-DD HH:mm',
      },
      // render(v) {
      //   return moment(v).format('YYYY-MM-DD HH:mm');
      // },
    }],
    oprs: true,
  },
  filters: [{
    field: {
      name: 'search',
    },
    input: {
      label: '搜索',
      placeholder: '输入用户编号或用户名检索',
      type: 'search',
      style: { width: 220 },
    },
    filter: {
      type: 'search',
      searchFeilds: ['userName', 'userCode'],
      matchType: 'includes', // includes, isEqual or function
    },
  }],
  createFields: [{
    label: '用户编号',
    field: 'userCode',
  }, {
    label: '用户名',
    field: 'userName',
  }, {
    label: '密码',
    field: 'userPassword',
    rules: [{ required: true }],
  }],
  editFields: [{
    label: '用户编号',
    field: 'userCode',
    type: 'readonly',
  }, {
    label: '用户名',
    field: 'userName',
  }, {
    label: '密码',
    field: 'userPassword',
    rules: [{ required: true }],
  }],
});
