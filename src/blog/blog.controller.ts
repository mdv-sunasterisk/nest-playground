import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './interfaces/blog.interface';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    /**
     * Retrieves all of the blog records, with the option to filter by category.
     * 
     * @param {string} category
     * @returns {Promise<Array<{}>>}
     */
    @Get()
    async fetchBlogs(@Query('category') category: string|null): Promise<Array<{}>> {
        return await this.blogService.fetchBlogs(category);
    }

    /**
     * Retrieves a single blog record.
     * 
     * @param {number} id
     * @returns {Promise<Blog|null>}
     */     
    @Get(':id')
    async fetchBlog(@Param('id', ParseIntPipe) id: number): Promise<Blog|null> {
        return await this.blogService.fetchBlog(id);
    }

    /**
     * Creates a new blog record.
     * 
     * @param {CreateBlogDto} createBlogDto
     * @returns {Promise<Blog>}
     */
    @Post()
    async createBlog(@Body(new ValidationPipe()) createBlogDto: CreateBlogDto ): Promise<Blog> {
        return await this.blogService.createBlog(createBlogDto);
    }
    
    /**
     * Update an existing blog record.
     * 
     * @param {number} id
     * @param {UpdateBlogDto} updateBlogDto
     * @returns {Promise<Blog|null>}
     */  
    @Patch(':id')
    async updateBlog(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateBlogDto: UpdateBlogDto): Promise<Blog|null> {
        return await this.blogService.updateBlog(id, updateBlogDto);
    }  
    
    /**
     * Delete an existing blog record.
     * 
     * @param {number} id
     * @returns {Promise<Blog|null>}
     */  
    @Delete(':id')
    async deleteBlog(@Param('id', ParseIntPipe) id: number): Promise<Blog|null> {
        return await this.blogService.deleteBlog(id);
    }
}