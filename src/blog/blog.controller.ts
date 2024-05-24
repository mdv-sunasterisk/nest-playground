import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Blog } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Blogs')
@ApiBearerAuth('access-token')
@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    /**
     * Retrieves all of the blog records, with the option to filter by category.
     * 
     * @param {string|null} category
     * @param {PaginationDto} paginationDto
     * @returns {Promise<{}>}
     */
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async fetchBlogs(@Query('category') category?: string|null, @Query() paginationDto?: PaginationDto): Promise<{}> {
        return await this.blogService.fetchBlogs(category, paginationDto);
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
     * @param {Express.Multer.File|undefined} image
     * @returns {Promise<Blog>}
     */
    @ApiCreatedResponse({ description: 'The record has been successfully created.' })
    @ApiForbiddenResponse({ description: 'Forbidden resource.' })
    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createBlog(@Body(new ValidationPipe()) createBlogDto: CreateBlogDto, @UploadedFile() image: Express.Multer.File|undefined): Promise<Blog> {
        return await this.blogService.createBlog(createBlogDto, image?.path);
    }
    
    /**
     * Update an existing blog record.
     * 
     * @param {number} id
     * @param {UpdateBlogDto} updateBlogDto
     * @param {Express.Multer.File} image
     * @returns {Promise<Blog|null>}
     */
    @UseGuards(AuthGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async updateBlog(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) updateBlogDto: UpdateBlogDto, @UploadedFile() image: Express.Multer.File): Promise<Blog|null> {
        return await this.blogService.updateBlog(id, updateBlogDto, image?.path);
    }  
    
    /**
     * Delete an existing blog record.
     * 
     * @param {number} id
     * @returns {Promise<Blog|null>}
     */
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteBlog(@Param('id', ParseIntPipe) id: number): Promise<Blog|null> {
        return await this.blogService.deleteBlog(id);
    }
}