import { ResourcePermission } from './ResourcePermission.interface';

export enum ResourceType {
  App = '1',
  Module = '2',
  Route = '0',
  Element = '3',
}

export interface Resource {
  name: string
  code: string
  type: ResourceType
  content: string
  icon?: string
  desc?: string
  parent?: Resource
  resourcePermissionRelations?: ResourcePermission
  _source?: object
  _parentCode?: string
}

export interface App extends Resource {
  type: ResourceType.App
  modules: Module[]
  homePath: string
}

export interface Module extends Resource {
  type: ResourceType.Module
  routes: Route[]
  moduleName: string
  path: string
}

export interface Route extends Resource {
  type: ResourceType.Route
  elements: Element[]
  children: Route[]
  path: string
}

export interface Element extends Resource {
  type: ResourceType.Element
}
