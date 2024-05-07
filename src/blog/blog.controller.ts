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
     * @returns {array}
     */
    @Get()
    fetchBlogs(@Query('category') category: string|null): Array<{}> {
        return this.blogService.fetchBlogs(category);
    }

    /**
     * Retrieves a single blog record.
     * 
     * @param {number} id
     * @returns {object}
     */     
    @Get(':id')
    fetchBlog(@Param('id', ParseIntPipe) id: number): {} {
        return this.blogService.fetchBlog(id);
    }

    /**
     * Creates a new blog record.
     * 
     * @param {CreateBlogDto} createBlogDto
     * @returns {Blog}
     */
    @Post()
    createBlog(@Body(new ValidationPipe()) createBlogDto: CreateBlogDto ): Blog {
        return this.blogService.createBlog(createBlogDto);
    }
    
    /**
     * Update an existing blog record.
     * 
     * @param {number} id
     * @param {UpdateBlogDto} updateBlogDto
     * @returns {Blog}
     */  
    @Patch(':id')
    updateBlog(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateBlogDto: UpdateBlogDto): Blog|{} {
        return this.blogService.updateBlog(id, updateBlogDto);
    }  
    
    /**
     * Delete an existing blog record.
     * 
     * @param {number} id
     * @returns {Blog|{}}
     */  
    @Delete(':id')
    deleteBlog(@Param('id', ParseIntPipe) id: number): Blog|{} {
        return this.blogService.deleteBlog(id);
    }
}