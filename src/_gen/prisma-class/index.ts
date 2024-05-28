import { Blog as _Blog } from './blog';
import { Comments as _Comments } from './comments';
import { User as _User } from './user';
import { Role as _Role } from './role';
import { Permissions as _Permissions } from './permissions';
import { RolesOnPermissions as _RolesOnPermissions } from './roles_on_permissions';

export namespace PrismaModel {
  export class Blog extends _Blog {}
  export class Comments extends _Comments {}
  export class User extends _User {}
  export class Role extends _Role {}
  export class Permissions extends _Permissions {}
  export class RolesOnPermissions extends _RolesOnPermissions {}

  export const extraModels = [
    Blog,
    Comments,
    User,
    Role,
    Permissions,
    RolesOnPermissions,
  ];
}
