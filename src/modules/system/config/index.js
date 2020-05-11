import ModuleConfig from 'services/ModuleConfig';
import { div } from 'gl-matrix/src/gl-matrix/vec4';

const restTableSchema = {
  idField: {
    title: 'id字段',
    desc: '资源的id字段，用于查询、更新、删除',
    type: 'string',
  },
  displayField: {
    title: '显示字段',
    desc: '数据项的显示字段，用于显示操作提醒等',
    type: 'string',
  },
  restPath: {
    title: 'rest请求资源路径',
    desc: 'curd资源的url路径',
    type: 'string',
  },
  list: {
    title: '列表配置',
    type: 'object',
    schema: {
      columns: {
        title: '列数组',
        type: 'array',
        schema: {
          title: {
            title: '列标题',
            type: 'string',
          },
          dateIndex: {
            title: '列索引',
            type: 'string',
          },
          key: {
            title: '列key',
            type: 'string',
          },
        },
      },
      oprs: {
        title: '行操作列',
        type: 'boolean',
      },
    },
  },
  createFields: {
    title: '创建字段',
    type: 'inputConfig',
  },
  editFields: {
    title: '创建字段',
    type: 'inputConfig',
  },
};

const rolesConfig = {
  idField: 'roleCode',
  displayField: 'roleName',
  restPath: '/auth/roles',
  list: {
    columns: [{
      title: '角色码',
      dataIndex: 'roleCode',
      key: 'roleCode',
    }, {
      title: '角色名',
      dataIndex: 'roleName',
      key: 'roleName',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      formatter: {
        type: 'date',
        style: 'YYYY-MM-DD HH:mm',
      },
    }],
    oprs: true,
  },
  createFields: [{
    label: '角色码',
    field: 'roleCode',
  }, {
    label: '角色名',
    field: 'roleName',
  }],
  editFields: [{
    label: '角色码',
    field: 'roleCode',
    type: 'readonly',
  }, {
    label: '角色名',
    field: 'roleName',
  }],
  filters: [{
    label: '筛选器数组',
    type: 'structArray',
    schema: {
      field: {
        label: '字段名',
        type: 'string',
      },
      input: {
        label: '输入类型',
        type: 'SuperInputType',
      },
      filter: {
        label: '过滤类型',
        type: 'filterType',
      },
    },
  }],
};

const permissionsConfig = {
  idField: 'resourceCode',
  displayField: 'resourceName',
  restPath: '/auth/resources',
  list: {
    columns: [{
      title: '资源类型',
      dataIndex: 'resourceType',
      key: 'resourceType',
      formatter: {
        type: 'permission-resource-type',
      },
    }, {
      title: '资源码',
      dataIndex: 'resourceCode',
      key: 'resourceCode',
    }, {
      title: '资源名',
      dataIndex: 'resourceName',
      key: 'resourceName',
    }, {
      title: '资源图标',
      dataIndex: 'resourceIcon',
      key: 'resourceIcon',
      // formatter: {
      //   type: 'date',
      //   style: 'YYYY-MM-DD HH:mm',
      // },
    }, {
      title: '父资源',
      dataIndex: 'parentResourceCode',
      key: 'parentResourceCode',
    }, {
      title: '资源内容',
      dataIndex: 'resourceContent',
      key: 'resourceContent',
    }],
    oprs: true,
  },
  createFields: [{
    label: '资源类型',
    field: 'resourceType',
    type: 'enum',
    options: [{
      label: '模块',
      value: 0,
    }, {
      label: '实体',
      value: 1,
    }, {
      label: '应用',
      value: 2,
    }],
    rules: [{ required: true }],
  }, {
    label: '资源码',
    field: 'resourceCode',
    rules: [{ required: true }],
  }, {
    label: '资源名',
    field: 'resourceName',
    rules: [{ required: true }],
  }, {
    label: '资源图标',
    field: 'resourceIcon',
  }, {
    label: '父资源',
    field: 'parentResourceCode',
  }, {
    label: '资源内容',
    field: 'resourceContent',
    rules: [{ required: true }],
  }, {
    label: '资源描述',
    field: 'resourceDesc',
    type: 'textArea',
  }],
  editFields: [{
    label: '资源类型',
    field: 'resourceType',
    type: 'enum',
    disabled: true,
    options: [{
      label: '模块',
      value: '0',
    }, {
      label: '实体',
      value: '1',
    }, {
      label: '应用',
      value: '2',
    }],
    rules: [{ required: true }],
  }, {
    label: '资源码',
    field: 'resourceCode',
    disabled: true,
    rules: [{ required: true }],
  }, {
    label: '资源名',
    field: 'resourceName',
    rules: [{ required: true }],
  }, {
    label: '资源图标',
    field: 'resourceIcon',
  }, {
    label: '父资源',
    field: 'parentResourceCode',
  }, {
    label: '资源内容',
    field: 'resourceContent',
    rules: [{ required: true }],
  }, {
    label: '资源描述',
    field: 'resourceDesc',
    type: 'textArea',
  }],
  filters: [/*{
    field: {
      name: 'operateTypes',
      label: '操作类型',
      initialValue: '',
    },
    input: {
      type: 'connect',
      compType: 'checkboxButtonGroup',
      withClear: true,
      extraInput: {
        type: 'string',
        label: '指定',
        placeholder: '输入工号',
        style: { width: 200 },
        wrapStyle: { display: 'inline-block' },
      },
      connectProps: {
        options: {
          path: 'dictionary.map.operateType',
          dataTransforms: [{
            type: 'mapArrayValuesByKeyMap',
            args: [{ label: 'name', value: 'code' }],
          }],
        },
      },
    },
    filter: {
      type: 'query',
      syncUrl: true,
    },
  },*/ {
    field: {
      name: 'resourceType',
      initialValue: '0',
    },
    input: {
      type: 'enum',
      // for test connectProps:
      // ajaxProps: {
      //   options: {
      //     url: '/hospital/hosDept',
      //     dataTransforms: [{
      //       type: 'get',
      //       args: ['queryResult']
      //     }, {
      //       type: 'mapArrayValuesByKeyMap',
      //       args: [{ label: 'deptName', value: 'deptCode' }]
      //     }, {
      //       type: 'unshift',
      //       args: [[{ label: 'buxian', value: 'b' }]]
      //     }]
      //     // tranform(resp) {
      //     //   return
      //     // }
      //     // mapValues: { label: 'deptName', value: 'deptCode' },
      //     // unshift: [{ label: 'buxian', value: 'b' }],
      //   }
      // }
      options: [{
        label: '模块',
        value: '0',
      }, {
        label: '实体',
        value: '1',
      }, {
        label: '应用',
        value: '2',
      }],
    },
    filter: {
      type: 'search',
      searchFeilds: ['resourceType'],
      matchType: 'isEqual', // includes, isEqual or function
      syncUrl: true,
    },
  }, {
    field: {
      name: 'search',
    },
    input: {
      type: 'search',
      placeholder: '输入编号或名称检索',
      style: { width: 220 },
    },
    filter: {
      type: 'search',
      searchFeilds: ['resourceName', 'resourceCode'],
      matchType: 'includes', // includes, isEqual or function
      syncUrl: true,
    },
  }],
};

const userPermissionsConfig = {
  userAppPath: () => `/auth/users/${app.services.services.auth.getCurrentId()}/userResourceMappings`,
};

export default new ModuleConfig('permissions', {
  roles: restTableSchema,
  permissions: restTableSchema,
}, {
  roles: rolesConfig,
  permissions: permissionsConfig,
  userPermissions: userPermissionsConfig,
});
