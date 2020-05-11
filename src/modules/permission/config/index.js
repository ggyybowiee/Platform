import ModuleConfig from 'services/ModuleConfig';
import PERMISSION_CREATE_CHILD_NODE_FORM from './permissionCreateChildNodeForm.json';
import PERMISSION_CREATE_APP_FORM from './permissionCreateAppForm.json';
import PERMISSION_EDIT_APP_NODE_FORM from './permissionEditAppNodeForm.json';
import PERMISSION_EDIT_FORM from './permissionEditForm.json';
import PERMISSION_GET_SELECT_MODULE_FORM from './permissionSelectModuleForm';
import PERMISSION_FILTER from './permissionFilter.json';
import PERMISSION_LIST_CONFIG from './permissionListConfig.json';
import ROLE_LIST from './roleList.json';
import ROLE_CREATE_FORM from './roleCreateForm.json';
import ROLE_EDIT_FORM from './roleEditForm.json';

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
  // createFields: {
  //   title: '创建字段',
  //   type: 'inputConfig',
  // },
  // editFields: {
  //   title: '创建字段',
  //   type: 'inputConfig',
  // },
};

const rolesConfig = {
  idField: 'roleCode',
  displayField: 'roleName',
  restPath: '/auth/roles',
  list: ROLE_LIST,
  createForm: ROLE_CREATE_FORM,
  editForm: ROLE_EDIT_FORM,
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
  list: PERMISSION_LIST_CONFIG,
  createChildNodeForm: PERMISSION_CREATE_CHILD_NODE_FORM,
  editAppForm: PERMISSION_EDIT_APP_NODE_FORM,
  createAppForm: PERMISSION_CREATE_APP_FORM,
  editForm: PERMISSION_EDIT_FORM,
  getModuleSelectForm: PERMISSION_GET_SELECT_MODULE_FORM,
  filterConfig: PERMISSION_FILTER,
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
  showRoleSwitch: true,
});
