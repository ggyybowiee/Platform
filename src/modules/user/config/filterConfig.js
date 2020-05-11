


export default {
  form: {
    elements: [{
      field: {
        name: 'userCode',
        label: '用户编码',
        initialValue: '',
      },
      input: {
        type: 'string',
        placeholder: '用户编码检索',
        style: { width: 200 },
      }
    }],
  },
  filters: [{
    key: 'userCode',
    type: 'query',
    syncUrl: true,
  }],
};
