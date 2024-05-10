import { Blog as _Blog } from './blog';
import { Comments as _Comments } from './comments';
import { User as _User } from './user';

export namespace PrismaModel {
  export class Blog extends _Blog {}
  export class Comments extends _Comments {}
  export class User extends _User {}

  export const extraModels = [Blog, Comments, User];
}
