import { Injectable } from '@nestjs/common';
import { CategoryType } from '../enums/category-type';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './interfaces/blog.interface';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
    
    private blogs: Blog[] =  [
        { id: 1, title: 'My First Blog', category: CategoryType.FICTION },
        { id: 2, title: 'My Second Blog', category: CategoryType.NONFICTION },
        { id: 3, title: 'My Third Blog', category: CategoryType.LITERATURE },
    ];

    /**
     * Retrieves all of the blog records, with the option to filter by category.
     * 
     * @param {string|null} category
     * @returns {array}
     */
    fetchBlogs(category: string|null): Array<{}> {
        if(!category) {
            return this.blogs;
        } else if(category != CategoryType.ALL) {
            return this.blogs.filter((blog) => blog.category == category);
        }

        return this.blogs;
    }
 
    /**
     * Retrieves a single blog record.
     * 
     * @param {number} id
     * @returns {object}
     */     
    fetchBlog(id: number): {} {
        return this.blogs.find((blog) => blog.id == id)
    }
    
    /**
     * Generate an incremented id value.
     * 
     * @returns number
     */  
    generateId() {
        if(this.blogs.length > 0) {
            const reversedArray = this.blogs.sort((a, b) => b.id - a.id);

            return reversedArray[0].id + 1;
        }

        return 1;
    }
    
    /**
     * Creates a new blog record.
     * 
     * @param {CreateBlogDto} createBlogDto
     * @returns {Blog}
     */     
    createBlog(createBlogDto: CreateBlogDto): Blog {
        const newBlog = {
            id: this.generateId(),
            title: createBlogDto.title,
            category: createBlogDto.category,
        };

        this.blogs.push(newBlog);

        return newBlog;
    }
     
    /**
     * Update an existing blog record.
     * 
     * @param {number} id
     * @param {UpdateBlogDto} updateBlogDto
     * @returns {Blog}
     */  
    updateBlog(id: number, updateBlogDto: UpdateBlogDto): Blog|{} {
        const selectedBlog = this.blogs.find((blog) => blog.id == id);

        if(selectedBlog) {
            selectedBlog.title = updateBlogDto.title;
            selectedBlog.category = updateBlogDto.category;

            return selectedBlog;
        }

        return {};
    }
     
    /**
     * Delete an existing blog record.
     * 
     * @param {number} id
     * @returns {Blog|{}}
     */  
    deleteBlog(id: number): Blog|{} {
        const selectedBlog = this.blogs.find((blog) => blog.id == id);
        const selectedIndex = this.blogs.findIndex((blog) => blog.id == id);

        if(selectedBlog) {
            this.blogs.splice(selectedIndex, 1);
        }
        
        return selectedBlog ?? {};
    }
}
