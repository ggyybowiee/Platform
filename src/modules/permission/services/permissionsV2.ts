import _ from 'lodash';
import { ResourceType, Resource, App, Module, Route, Element } from '../classes/Resource.interface';
import { ResourcePermission } from '../classes/ResourcePermission.interface';
import { Permission } from '../classes/Permission.interface';
import { getApi } from 'utils/request';

const PERMISSION_ID_FIELD = 'resourceCode';

const RESOURCE_TYPE_MAP = {
  app: ResourceType.App,
  module: ResourceType.Module,
  route: ResourceType.Route,
  element: ResourceType.Element,
};

const RESOURCE_CODE_FIELD = 'code';
const RESOURCE_NAME_FIELD = 'name';
const RESOURCE_PARENT_FIELD = 'parentCode';
const RESOURCE_ICON_FIELD = 'icon';
const RESOURCE_TYPE_FIELD = 'type';
const RESOURCE_CONTENT_FIELD = 'content';
const RESOURCE_DESC_FIELD = 'description';

const RESOURCE_PERMISSION_RELATION_CODE_FIELD = 'code';
const RESOURCE_PERMISSION_RELATION_RESOURCE_FIELD = 'resource';
const RESOURCE_PERMISSION_RELATION_PERMISSION_FIELD = 'permission';
const RESOURCE_PERMISSION_RELATION_RESOURCE_CODE_FIELD = 'res_code';

const PERMISSION_CODE_FIELD = 'code';
const PERMISSION_NAME_FIELD = 'name';
const PERMISSION_TYPE_FIELD = 'type';
const PERMISSION_ICON_FIELD = 'icon';

function convertResource(rawResource: { resourcePermissionRelations: object[] }): Resource {
  return {
    name: rawResource[RESOURCE_NAME_FIELD],
    code: rawResource[RESOURCE_CODE_FIELD],
    type: RESOURCE_TYPE_MAP[rawResource[RESOURCE_TYPE_FIELD]],
    content: rawResource[RESOURCE_CONTENT_FIELD],
    icon: rawResource[RESOURCE_ICON_FIELD],
    desc: rawResource[RESOURCE_DESC_FIELD],
    _source: rawResource,
    _parentCode: rawResource[RESOURCE_PARENT_FIELD],
  };
}

function convertPermission(rawResourcePermissionRelation): Permission {
  return {
    code: rawResourcePermissionRelation[PERMISSION_CODE_FIELD],
    name: rawResourcePermissionRelation[PERMISSION_NAME_FIELD],
    type: rawResourcePermissionRelation[PERMISSION_TYPE_FIELD],
    icon: rawResourcePermissionRelation[PERMISSION_ICON_FIELD],
  };
}

export const buildResourcesTree = (rawResourcesPermissionList) => {
  const resources: Resource[] = _.chain(rawResourcesPermissionList)
    .map((resourcePermission): ResourcePermission => ({
      code: resourcePermission[RESOURCE_PERMISSION_RELATION_CODE_FIELD],
      resource: convertResource(resourcePermission.resource),
      permission: resourcePermission.permisstion ? convertPermission(resourcePermission.permisstion) : null,
      _source: resourcePermission,
    }))
    .groupBy(`resource.${RESOURCE_CODE_FIELD}`)
    .map(list => ({
      ..._.first(list).resource,
      resourcePermissionRelations: list,
    }))
    .value();

  const resourcesMap: { [key: string]: Resource } = _.mapKeys(resources, 'code');
  _.forEach(resources, (resource: Resource) => {
    resource.parent = resourcesMap[resource._parentCode];
  });

  const groupedResources = _.groupBy(resources, 'type');
  const apps: App[] = groupedResources[ResourceType.App] || [];
  const modules: Module[] = groupedResources[ResourceType.Module] || [];
  const routes: Route[] = groupedResources[ResourceType.Route] || [];
  const elements: Element[] = groupedResources[ResourceType.Element] || [];

  const modulesMap = _.mapKeys(modules, 'code');
  _.forEach(apps, (app: App) => {
    let appContent;
    try {
      appContent = app.content
        ? JSON.parse(app.content)
        : {
            homePath: '/',
            modules: [],
          };
    } catch (err) {
      appContent = {
        homePath: '/',
        modules: [],
      };
    }
    app.homePath = appContent.homePath;
    app.modules = _.chain(appContent.modules)
      .map(m => modulesMap[m])
      .reject(_.isEmpty)
      .value();
  });

  // 解析模块、路由关系
  _.forEach(modules, (m: Module) => {
    m.routes = _.filter(routes, (route: Route) => route.parent && route.parent.code === m.code);
    m.path = `/${m.content}`;
  });

  // 解析路由关系
  _.forEach(routes, (route: Route) => {
    route.children = _.filter(
      routes,
      (childRoute: Route) =>
        childRoute.parent &&
        childRoute.parent.code === route.code &&
        childRoute.code !== (childRoute.parent && childRoute.parent.code)
    );
    route.elements = _.filter(
      elements,
      (element: Element) => element.parent && element.parent.code === route.code
    );
  });

  // 拼接路由路径
  _.forEachTreeNodes(routes, route => {
    if (!route.parent) {
      return;
    }
    route.path = `${route.parent.path}/${route.content}`;
  });

  return {
    apps,
    modules,
    routes,
    elements,
  };
};

export const fetchResourcesByRole = async roleId => {
  const resourcePermissionRelationList = await getApi('/resourcePermisstion/findMy');

  return buildResourcesTree(resourcePermissionRelationList);
  // const [ permissions, rolePermissions ] = await Promise.all([
  //   getApi('/auth/resources'),
  //   getApi(`/auth/roles/${roleId}/roleResourceMappings`),
  // ]);

  // const allowedRolePermissions = _.filter(rolePermissions, item => item.relation == 1);

  // const permissionsIdMap = _.mapKeys(permissions, PERMISSION_ID_FIELD);
  // const userPermissions = _.map(allowedRolePermissions, item => {
  //   return permissionsIdMap[item[PERMISSION_ID_FIELD]];
  // });

  // return buildResourcesTree(userPermissions);
};

export const fetchAllResourcePermisions = async () => {
  const [ rawResources, rawPermissions, rawResourcePermissions ] = yield Promise.all([
    getApi('/resource/find/base'),
    getApi('/permisstion/find/base'),
    getApi('/resourcePermisstion/find/base'),
  ]);
  const resourcesMap = _.mapKeys(rawResources, 'code');
  const permissionsMap = _.mapKeys(rawPermissions, 'code');
  const resourcePermissions = _.chain(rawResourcePermissions)
    .map((resourcePermission): resourcePermission => ({
      ...resourcePermission,
      resource: resourcesMap[resourcePermission.resCode],
      permisstion: permissionsMap[resourcePermission.perCode],
    }))
    .value();
  const noPermissionsResource = _.chain(rawResources)
    .difference(_.map(resourcePermissions, 'resource'))
    .map(resource => ({
      resCode: resource.code,
      resource,
    }))
    .value();
  const resourcePermissionsWithNoPermissions = [
    ...resourcePermissions,
    ...noPermissionsResource,
  ];

console.log('xxxx', resourcePermissionsWithNoPermissions);
  // const resourcePermissionRelationList = await getApi('/resourcePermisstion/findMy');

  return buildResourcesTree(resourcePermissionsWithNoPermissions);
}

const mockApiData = [
  {
    id: 1,
    resCode: 'RS001',
    perCode: 'Per001',
    code: 'RT001',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 1,
      code: 'RS001',
      name: '顶层访问',
      createTime: null,
      createUser: null,
      type: 'app',
      icon: null,
      parentCode: null,
      description: null,
      content: '{"homePath":"/","modules":["store"]}',
    },
    permisstion: {
      id: 1,
      name: 'view',
      code: 'Per001',
      createTime: null,
      createUser: null,
      description: '可否查看',
    },
  },
  {
    id: 2,
    resCode: 'RS002',
    perCode: 'Per001',
    code: 'RT002',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 2,
      code: 'RS002',
      name: '商品管理',
      createTime: null,
      createUser: null,
      type: 'module',
      icon: null,
      parentCode: 'RS001',
      description: null,
      content: null,
    },
    permisstion: {
      id: 1,
      name: 'view',
      code: 'Per001',
      createTime: null,
      createUser: null,
      description: '可否查看',
    },
  },
  {
    id: 3,
    resCode: 'RS003',
    perCode: 'Per001',
    code: 'RT002',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 2,
      code: 'RS003',
      name: '维度管理',
      createTime: null,
      createUser: null,
      type: 'route',
      icon: null,
      parentCode: 'RS002',
      description: null,
      content: null,
    },
    permisstion: {
      id: 1,
      name: 'view',
      code: 'Per001',
      createTime: null,
      createUser: null,
      description: '可否查看',
    },
  },
  {
    id: 4,
    resCode: 'RS004',
    perCode: 'Per002',
    code: 'RT004',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 4,
      code: 'RS004',
      name: '活动添加按钮',
      createTime: null,
      createUser: null,
      type: 'element',
      icon: null,
      parentCode: 'RS003',
      description: null,
      content: null,
    },
    permisstion: {
      id: 2,
      name: 'click',
      code: 'Per002',
      createTime: null,
      createUser: null,
      description: '可否点击',
    },
  },
  {
    id: 5,
    resCode: 'RS005',
    perCode: 'Per002',
    code: 'RT005',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 4,
      code: 'RS005',
      name: '活动添加按钮',
      createTime: null,
      createUser: null,
      type: 'element',
      icon: null,
      parentCode: 'RS003',
      description: null,
      content: null,
    },
    permisstion: {
      id: 2,
      name: 'click',
      code: 'Per002',
      createTime: null,
      createUser: null,
      description: '可否点击',
    },
  },
];
