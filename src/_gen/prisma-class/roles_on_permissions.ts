import { Role } from './role';
import { Permissions } from './permissions';
import { ApiProperty } from '@nestjs/swagger';

export class RolesOnPermissions {
  @ApiProperty({ type: Number })
  roleId: number;

  @ApiProperty({ type: () => Role })
  role: Role;

  @ApiProperty({ type: Number })
  permissionsId: number;

  @ApiProperty({ type: () => Permissions })
  permissions: Permissions;
}
