import { Blog } from './blog';
import { User } from './user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Comments {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  postId: number;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => Blog })
  blog?: Blog;

  @ApiPropertyOptional({ type: Number })
  blogId?: number;

  @ApiPropertyOptional({ type: () => User })
  User?: User;

  @ApiPropertyOptional({ type: Number })
  userId?: number;
}
