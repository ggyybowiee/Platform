import { ResourcePermission } from './ResourcePermission.interface';

export default interface Role {
  name: string,
  code: string,
  icon?: string,
  resourcePermissions?: [ResourcePermission]
}
