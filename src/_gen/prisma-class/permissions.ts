import { RolesOnPermissions } from './roles_on_permissions';
import { ApiProperty } from '@nestjs/swagger';

export class Permissions {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ isArray: true, type: () => RolesOnPermissions })
  RolesOnPermissions: RolesOnPermissions[];
}
