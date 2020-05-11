
const _ = window.platform.vendor.lodash;

export function findPermissionTypeByCode(permissions, code) {
  return _.chain(permissions)
    .find({ resourceCode: code })
    .get('resourceType')
    .value();
}

export function parsePermissionsToTree(permissions) {
  return _.chain(permissions)
      .map(item => ({
        title: item.resourceName,
        key: item.resourceCode,
        parent: item.parentResourceCode,
        type: item.resourceType,
        source: item,
        children: [],
      }))
      .mapKeys('key')
      .forEach((item, index, nodes) => {
        if (!item.parent || !nodes[item.parent]) {
          return;
        }
        nodes[item.parent].children.push(item);
        item.parent = nodes[item.parent];
      })
      .filter(item => _.isEmpty(item.parent))
      .groupBy('type')
      .map((permissionsTree, groupType) => ({
        type: groupType,
        title: ({
          '1': '应用',
          '2': '模块',
          '0': '路由',
        })[groupType],
        permissionsTree: _.mapTreeNodes(permissionsTree, node => {
          let path = '';
          let tmpNode = node;

          while (tmpNode) {
            path = `/${tmpNode.source.resourceContent}${path}`;
            tmpNode = tmpNode.parent;
          }

          return ({
            ...node,
            path,
          });
        }),
      }))
      .value();
}

// TODO: 完成后替换上面一个函数
export function resolveAppPermissions(permissionTypeTree) {
  const permissionTypeTreeMap = _.mapKeys(permissionTypeTree, 'type');
  if (!permissionTypeTreeMap['1']) {
    return [];
  }

  const modules = permissionTypeTreeMap['2'] ? permissionTypeTreeMap['2'].permissionsTree : [];
  const modulesMap = _.mapKeys(modules, 'key');

  return _.chain(permissionTypeTreeMap['1'].permissionsTree)
    .map(app => {
      if (!app.source.resourceContent) {
        return app;
      }

      const appModules = app.source.resourceContent.split(',');
      return {
        ...app,
        children: _.chain(appModules)
          .map(m => modulesMap[m])
          .filter(_.identity)
          .value(),
      };
    })
    .value();
}
