import { ResourceType } from './classes/Resource.interface';

export const getResourceTypeName = (type: string | number): string => ({
  [ResourceType.App]: '应用',
  [ResourceType.Module]: '模块',
  [ResourceType.Route]: '路由',
  [ResourceType.Element]: '元素',
})[type];
