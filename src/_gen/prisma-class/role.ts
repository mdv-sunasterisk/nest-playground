import { RolesOnPermissions } from './roles_on_permissions';
import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ isArray: true, type: () => RolesOnPermissions })
  RolesOnPermissions: RolesOnPermissions[];

  @ApiProperty({ isArray: true, type: () => User })
  User: User[];
}
