import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Blog } from "src/_gen/prisma-class/blog";

export class CreateBlogDto implements Partial<Blog> {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;
    
    @IsNotEmpty()
    @IsString()
    category: string;
}