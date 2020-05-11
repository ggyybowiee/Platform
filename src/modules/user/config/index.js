import ModuleConfig from 'services/ModuleConfig';
import CREATE_FORM from './createForm.json';
import EDIT_FORM from './editForm.json';
import FILTER_CONFIG from './filterConfig';

export default new ModuleConfig('user', {
  idField: {
    title: 'id字段',
    desc: '用户数据的id字段，用于查询、更新、删除',
    type: 'string',
  },
  userNameField: {
    title: '用户名字段',
    desc: '用户数据的用户名字段，用于显示操作提醒等',
    type: 'string',
  },
  restPath: {
    title: 'rest请求用户资源路径',
    desc: 'curd用户资源的url路径',
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
}, {
  idField: 'userCode',
  userNameField: 'userName',
  restPath: '/auth/users/page',
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
  filterConfig: FILTER_CONFIG,
  createForm: CREATE_FORM,
  editForm: EDIT_FORM,
});
