import ModuleConfig from 'services/ModuleConfig';

export default new ModuleConfig('auth', {
  login: {
    title: '登录配置',
    type: 'object',
    schema: {
      path: { title: '登录路径', type: 'string', desc: '登录提交路径' },
      fieldsMap: { title: '字段映射', type: 'object', desc: '登录字段映射，key为提交字段，value为页面绑定字段（可选username、password）' },
    },
  },
  userIdField: {
    title: '用户id字段',
    type: 'string',
    default: 'userCode',
  },
  userNameField: {
    title: '用户名字段',
    type: 'string',
    default: 'userName',
  },
  avatarField: {
    title: '头像字段',
    type: 'string',
    default: 'avatar',
  },
}, {
  login: {
    path: '/auth/tokens',
    fieldsMap: {
      userCode: 'username',
      password: 'password',
    },
  },
  userIdField: 'userCode',
  userNameField: 'userName',
  avatarField: 'avatar',
  userNamePlaceholder: '账号',
  passwordPlaceholder: '密码',

  getJwt: function(resp) {
    return resp.tokenContent;
  },
  getUser: function(resp) {
    const user = { ...resp };
    delete user.jwt;
    delete user.roles;
    return user;
  },
  getRoles: function(resp) {
    return resp.roles;
  }
});
