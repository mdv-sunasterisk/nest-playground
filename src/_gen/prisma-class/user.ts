import { Comments } from './comments';
import { Blog } from './blog';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  lastName: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  mobileNumber: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiPropertyOptional({ type: Date })
  emailVerifiedAt?: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ isArray: true, type: () => Comments })
  comments: Comments[];

  @ApiProperty({ isArray: true, type: () => Blog })
  blogs: Blog[];
}
