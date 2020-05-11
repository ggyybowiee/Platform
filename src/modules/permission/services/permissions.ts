import _ from 'lodash';
import {
  ResourceType, Resource,
  App, Module, Route, Element,
} from '../classes/Resource.interface';
import { getApi } from 'utils/request';

const PERMISSION_ID_FIELD = 'resourceCode';

const RESOURCE_TYPE_MAP = {
  '1': ResourceType.App,
  '2': ResourceType.Module,
  '0': ResourceType.Route,
  '3': ResourceType.Element,
};

const RESOURCE_CODE_FIELD = 'resourceCode';
const RESOURCE_NAME_FIELD = 'resourceName';
const RESOURCE_PARENT_FIELD = 'parentResourceCode';
const RESOURCE_ICON_FIELD = 'resourceIcon';
const RESOURCE_TYPE_FIELD = 'resourceType';
const RESOURCE_CONTENT_FIELD = 'resourceContent';
const RESOURCE_DESC_FIELD = 'resourceDesc';

function convertResource(rawResource: Object): Resource {
  return {
    name: rawResource[RESOURCE_NAME_FIELD],
    code: rawResource[RESOURCE_CODE_FIELD],
    type: RESOURCE_TYPE_MAP[rawResource[RESOURCE_TYPE_FIELD]],
    content: rawResource[RESOURCE_CONTENT_FIELD],
    icon: rawResource[RESOURCE_ICON_FIELD],
    desc: rawResource[RESOURCE_DESC_FIELD],
    _source: rawResource,
  };
}

export const buildResourcesTree = (rawResources) => {
  const compactedRawResources = _.compact(rawResources);
  const rawResourcesMap = _.mapKeys(compactedRawResources, RESOURCE_CODE_FIELD);
  const resources: Resource = _.map(compactedRawResources, convertResource);
  const resourcesMap: {[key: string]: Resource} = _.mapKeys(resources, 'code');
  _.forEach(resources, (resource: Resource) => {
    const rawResource = rawResourcesMap[resource.code];
    const parentCode = rawResource[RESOURCE_PARENT_FIELD];
    resource.parent = resourcesMap[parentCode];
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
      appContent = JSON.parse(app.content);
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
  _.forEach(modules, (m: Module) => {
    m.routes = _.filter(routes, (route: Route) => (route.parent && route.parent.code === m.code));
    m.path = `/${m.content}`;
  });
  _.forEach(routes, (route: Route) => {
    route.children = _.filter(routes, (childRoute: Route) => (
      childRoute.parent
      && childRoute.parent.code === route.code
      && childRoute.code !== (childRoute.parent && childRoute.parent.code)
    ));
    route.elements = _.filter(elements, (element: Element) => (element.parent && element.parent.code === route.code));
  });

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
}

export const fetchResourcesByRole = async (roleId) => {
  const [ permissions, rolePermissions ] = await Promise.all([
    getApi('/auth/resources'),
    getApi(`/auth/roles/${roleId}/roleResourceMappings`),
  ]);

  const allowedRolePermissions = _.filter(rolePermissions, item => item.relation == 1);

  const permissionsIdMap = _.mapKeys(permissions, PERMISSION_ID_FIELD);
  const userPermissions = _.map(allowedRolePermissions, item => {
    return permissionsIdMap[item[PERMISSION_ID_FIELD]];
  });

  return buildResourcesTree(userPermissions);
}
