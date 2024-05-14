import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

describe('BlogController', () => {
  let controller: BlogController;

  const mockBlogService = {
    fetchBlogs: jest.fn(),
    fetchBlog: jest.fn(),
    createBlog: jest.fn(),
    updateBlog: jest.fn(),
    deleteBlog: jest.fn(),
  }

  const mockAuthGuard = {
    canActivate: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: mockBlogService
        }
      ],
    }).overrideGuard(AuthGuard).useValue(mockAuthGuard).compile();

    controller = module.get<BlogController>(BlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('fetchBlogs > should return an existing array of blogs', async () => {
    const validFetchBlogsResponse = [
      {
        id: 1,
        title: "My Second Blog",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel.",
        category: "Literature",
        createdAt: "2024-05-10T06:25:24.843Z",
        updatedAt: "2024-05-10T06:25:24.843Z"
      },
      {
        id: 2,
        title: "My New Blog",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel.",
        category: "NonFiction",
        createdAt: "2024-05-14T09:26:53.515Z",
        updatedAt: "2024-05-14T09:26:53.515Z"
      }
    ];

    jest.spyOn(mockBlogService, 'fetchBlogs').mockReturnValue(validFetchBlogsResponse);
    
    const fetchBlogsResponse = await controller.fetchBlogs();

    expect(fetchBlogsResponse).toEqual(validFetchBlogsResponse);
  });

  it('fetchBlog > should return an existing blog object', async () => {
    const blogId = 1
  
    const validFetchBlogResponse = {
      id: 1,
      title: "My First Blog",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel.",
      category: "Literature",
      createdAt: "2024-05-10T06:25:24.843Z",
      updatedAt: "2024-05-10T06:25:24.843Z"
    };

    jest.spyOn(mockBlogService, 'fetchBlog').mockReturnValue(validFetchBlogResponse);
    
    const fetchBlogResponse = await controller.fetchBlog(blogId);

    expect(fetchBlogResponse).toEqual(validFetchBlogResponse);
  });

  it('createBlog > should return a created blog object', async () => {
    const createBlogDto: CreateBlogDto = {
      title: "My First Blog",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel.",
      category: "Literature",
    }

    const validCreateBlogResponse = {
      id: 1,
      title: createBlogDto.title,
      content: createBlogDto.content,
      category: createBlogDto.category,
      createdAt: "2024-05-10T06:25:24.843Z",
      updatedAt: "2024-05-10T06:25:24.843Z"
    };

    jest.spyOn(mockBlogService, 'createBlog').mockReturnValue(validCreateBlogResponse);
    
    const createBlogResponse = await controller.createBlog(createBlogDto);

    expect(createBlogResponse).toEqual(validCreateBlogResponse);
  });

  it('updateBlog > should return an updated blog object', async () => {
    const blogId = 1;
  
    const UpdateBlogDto: UpdateBlogDto = {
      title: "My First Blog",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel.",
      category: "Literature",
    }

    const validUpdateBlogResponse = {
      id: 1,
      title: "My Updated Blog",
      content: "New Content",
      category: "Fiction",
      createdAt: "2024-05-10T06:25:24.843Z",
      updatedAt: Date.now()
    };

    jest.spyOn(mockBlogService, 'updateBlog').mockReturnValue(validUpdateBlogResponse);
    
    const updateBlogResponse = await controller.updateBlog(blogId, UpdateBlogDto);

    expect(updateBlogResponse).toEqual(validUpdateBlogResponse);
  });

  it('deleteBlog > should return a deleted blog object', async () => {
    const blogId = 1
  
    const validDeleteBlogResponse = {
      id: 1,
      title: "My First Blog",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel.",
      category: "Literature",
      createdAt: "2024-05-10T06:25:24.843Z",
      updatedAt: "2024-05-10T06:25:24.843Z"
    };

    jest.spyOn(mockBlogService, 'deleteBlog').mockReturnValue(validDeleteBlogResponse);
    
    const deleteBlogResponse = await controller.deleteBlog(blogId);

    expect(deleteBlogResponse).toEqual(validDeleteBlogResponse);
  });
});
