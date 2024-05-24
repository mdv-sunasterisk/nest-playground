import { Injectable } from '@nestjs/common';
import { CategoryType } from '../enums/category-type';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Blog } from '@prisma/client';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class BlogService {

    constructor(private prisma: PrismaService) {}

    /**
     * Retrieves all of the blog records, with the option to filter by category.
     * 
     * @param {string|null} category
     * @param {PaginationDto} paginationDto
     * @returns {Promise<{}>}
     */
    async fetchBlogs(category?: string|null, paginationDto?: PaginationDto): Promise<{}> {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const take = limit;

        const queryOptions = { skip, take };

        const returnObject = { 
            page,
            limit,
            totalBlogCount: await this.prisma.blog.count() 
        };

        if(!category || category == CategoryType.ALL) {
            return Object.assign(returnObject, { blogs: await this.prisma.blog.findMany(queryOptions) });
        } 

        const newQueryOptions = Object.assign(queryOptions, { where: { category } });

        return Object.assign(returnObject, { blogs: await this.prisma.blog.findMany(newQueryOptions) });
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
     * @param {string|undefined} imagePath
     * @returns {Promise<Blog>}
     */     
    async createBlog(createBlogDto: CreateBlogDto, imagePath: string|undefined): Promise<Blog> {
        let vars = {
            title   : createBlogDto.title,
            content : createBlogDto.content,
            category: createBlogDto.category,
        };

        if(imagePath) {
            vars = Object.assign(vars, { imagePath });
        }

        const newBlog = this.prisma.blog.create({ data: vars });

        return newBlog;
    }
     
    /**
     * Update an existing blog record.
     * 
     * @param {number} id
     * @param {UpdateBlogDto} updateBlogDto
     * @param {string|undefined} imagePath
     * @returns {Promise<Blog|null>}
     */  
    async updateBlog(id: number, updateBlogDto: UpdateBlogDto, imagePath: string|undefined): Promise<Blog|null> {
        const selectedBlog = await this.fetchBlog(id);

        if(selectedBlog) {
            let vars = {
                title: updateBlogDto.title,
                content: updateBlogDto.content,
                category: updateBlogDto.category,
            };

            if(imagePath) {
                vars = Object.assign(vars, { imagePath });
            }

            return this.prisma.blog.update({
                where: { id: selectedBlog.id },
                data: vars
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
