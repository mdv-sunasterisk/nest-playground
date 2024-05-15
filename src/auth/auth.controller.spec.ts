import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  it('login > should return a user object and an access token', async () => {
    const loginDto: LoginDto = {
      email: 'sample@gmail.com',
      password: 'password'
    }

    const validLoginMockResponse = {
      user: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@gmail.com",
        mobileNumber: "09172838283",
        password: "$2b$10$5QqWEZZGYoTv0gWrpRvqeueljbC9O694B.ulLsH5ozvOZrEvYl6GG",
        createdAt: "2024-05-10T06:24:55.770Z",
        updatedAt: "2024-05-10T06:24:55.770Z"
      },
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibGVicm9uQGdtYWlsLmNvbSIsImlhdCI6MTcxNTY2MzQ1MSwiZXhwIjoxNzE1NjY3MDUxfQ.EJWk7xs5MjhhprjEfE5ySvMGi84klpxHrHLGtlwerTI"
    };

    jest.spyOn(mockAuthService, 'login').mockReturnValue(validLoginMockResponse);

    const loginResponse = await controller.login(loginDto);

    expect(mockAuthService.login).toHaveBeenCalledTimes(1)
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    expect(loginResponse).toEqual(validLoginMockResponse);
  })

  it('should return a user object', async () => {
    const registerDto: RegisterDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@gmail.com",
      mobileNumber: "09172838283",
      password: "password",
      passwordConfirmation: "password",
    }
    
    const validRegisterResponse = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@gmail.com",
      mobileNumber: "09172838283",
      password: "$2b$10$gHEKG7y1.6blSOsJmNTNiOwi8Mi5DNi1w/oWPFZO0tdFYa9XqNfC2",
      createdAt: "2024-05-14T09:05:28.989Z",
      updatedAt: "2024-05-14T09:05:28.989Z"
    };

    jest.spyOn(mockAuthService, 'register').mockReturnValue(validRegisterResponse);

    const registerResponse = await controller.register(registerDto);

    expect(mockAuthService.register).toHaveBeenCalledTimes(1)
    expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    expect(registerResponse).toEqual(validRegisterResponse);
  });
});
