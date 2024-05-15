import { IsNotEmpty, IsString } from 'class-validator';
import { Comments } from './comments';
import { User } from './user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Blog {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: String })
  @IsNotEmpty()
  @IsString()
  content?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ isArray: true, type: () => Comments })
  comments: Comments[];

  @ApiPropertyOptional({ type: () => User })
  User?: User;

  @ApiPropertyOptional({ type: Number })
  userId?: number;
}
