const _ = platform.vendor.lodash;

const PERMISSION_ID = 'resourceContent';

platform.hooks.registerHook('currentMenu', (menu, appCode) => {
  const permissionsTree = platform.services.services.platform.store.get('permissions.currentPermissions');

  if (!permissionsTree) {
    return [[]];
  }

  const app = _.find(permissionsTree, { code: appCode });

  if (!app) {
    return [[]];
  }

  const nodesTree = _.map(app.modules, m => ({ ...m, children: m.routes }));
  // 计算拥有的权限路径，再将菜单中没有在这个权限路径里的元素删除
  const pathsMap = {};
  _.forEachTreeNodes(nodesTree, (node, key, parentNode) => {
    pathsMap[node.path] = 1;
  });
  const resultMenuArray = _.filterTreeNodes(menu, item => pathsMap[item.path]);

  return [resultMenuArray];
});
