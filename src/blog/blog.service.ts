import { Injectable } from '@nestjs/common';
import { CategoryType } from '../enums/category-type';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './interfaces/blog.interface';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BlogService {

    constructor(private prisma: PrismaService) {}

    /**
     * Retrieves all of the blog records, with the option to filter by category.
     * 
     * @param {string|null} category
     * @returns {Promise<Array<{}>>}
     */
    async fetchBlogs(category: string|null): Promise<Array<{}>> {
        if(!category || category != CategoryType.ALL) {
            return this.prisma.blog.findMany();
        } 
    
        return this.prisma.blog.findMany({
            where: {
                category: category
            }
        });
    }
 
    /**
     * Retrieves a single blog record.
     * 
     * @param {number} id
     * @returns {Promise<Blog|null>}
     */     
    async fetchBlog(id: number): Promise<Blog|null>  {
        const blog = await this.prisma.blog.findFirst({
            where: {
                id: id    
            }
        })

        return blog;
    }
    
    /**
     * Creates a new blog record.
     * 
     * @param {CreateBlogDto} createBlogDto
     * @returns {Promise<Blog>}
     */     
    async createBlog(createBlogDto: CreateBlogDto): Promise<Blog> {
        const newBlog = this.prisma.blog.create({
            data: {
                title   : createBlogDto.title,
                content : createBlogDto.content,
                category: createBlogDto.category,
            }
        })

        return newBlog;
    }
     
    /**
     * Update an existing blog record.
     * 
     * @param {number} id
     * @param {UpdateBlogDto} updateBlogDto
     * @returns {Promise<Blog|null>}
     */  
    async updateBlog(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog|null> {
        const selectedBlog = await this.fetchBlog(id);

        if(selectedBlog) {
            return this.prisma.blog.update({
                where: {
                    id: selectedBlog.id
                },
                data: {
                    title: updateBlogDto.title,
                    content: updateBlogDto.content,
                    category: updateBlogDto.category,
                }
            })
        }

        return selectedBlog;
    }
     
    /**
     * Delete an existing blog record.
     * 
     * @param {number} id
     * @returns {Promise<Blog|null>}
     */  
    async deleteBlog(id: number): Promise<Blog|null> {
        const selectedBlog = await this.fetchBlog(id);

        if(selectedBlog) {
            return this.prisma.blog.delete({
                where: {
                    id: selectedBlog.id
                }
            })
        }
        
        return selectedBlog;
    }
}
