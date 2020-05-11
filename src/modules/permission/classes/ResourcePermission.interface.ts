import { Permission } from './Permission.interface';
import { Resource } from './Resource.interface';

export interface ResourcePermission {
  code: string,
  permission: Permission,
  resource: Resource,
  _source: object,
}
