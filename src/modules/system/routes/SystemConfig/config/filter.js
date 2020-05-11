export default {
  form: {
    elements: [{
      field: {
        name: 'systemCode',
        label: '系统',
        initialValue: '',
      },
      input: {
        "type": "connect",
        "compType": "enum",
        "enumType": "select",
        "disabled": false,
        "style": { "width": 100 },
        "connectProps": {
          "options": {
            "path": "dictionary.map.operateType",
            "dataTransforms": [{
              "type": "mapArrayValuesByKeyMap",
              "args": [{ "label": "name", "value": "code" }]
            }, {
              "type": "concat",
              "args": [{ "label": "所有配置", "value": "" }]
            }]
          }
        }
      },
    }, {
      field: {
        name: 'search',
        label: '搜索',
      },
      input: {
        type: 'search',
        placeholder: '通过系统、模块、编码、描述过滤配置项目',
        style: { width: 360 },
      },
    }]
  },
  filters: [{
    key: 'systemCode',
    type: 'query',
  }, {
    key: 'search',
    type: 'search',
    searchKeys: ['system'],
  }]
}
