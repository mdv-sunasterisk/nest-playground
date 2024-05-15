import { PickType } from "@nestjs/swagger";
import { Blog } from "src/_gen/prisma-class/blog";

export class CreateBlogDto extends PickType(Blog, ['title', 'content', 'category']) {}