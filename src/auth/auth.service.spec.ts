import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
    }
  };

  const mockPasswordService = {
    hashPassword: jest.fn(),
    validatePassword: jest.fn()
  };

  const mockJwtService = {
    signAsync: jest.fn()
  };

  const mockUserResponse = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@gmail.com",
    mobileNumber: "09172838283",
    password: "$2b$10$oOh9WCRTmAPw.kohhr9HF.oXC/MxraBc3NL8ooYFczwF4U2ZgtjWi",
    createdAt: "2024-05-14T09:05:28.989Z",
    updatedAt: "2024-05-14T09:05:28.989Z"
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Register', () => {
    it('register > should return a created user object', async () => {
      const registerDto: RegisterDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@gmail.com",
        mobileNumber: "09172838283",
        password: "password",
        passwordConfirmation: "password",
      };
  
      const mockPrismaCreateArg = { 
        data: {
          firstName: mockUserResponse.firstName,
          lastName: mockUserResponse.lastName,
          email: mockUserResponse.email,
          mobileNumber: mockUserResponse.mobileNumber,
          password: mockUserResponse.password,
        } 
      };
  
      jest.spyOn(mockPasswordService, 'hashPassword').mockReturnValueOnce(mockUserResponse.password);
  
      jest.spyOn(mockPrismaService.user, 'create').mockReturnValueOnce(mockUserResponse);
  
      const registerResponse = await service.register(registerDto);
  
      expect(mockPasswordService.hashPassword).toHaveBeenCalledTimes(1);
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(registerDto.password);
  
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith(mockPrismaCreateArg);
      expect(registerResponse).toEqual(mockUserResponse);
    });

    it('should throw an error for an unsuccessful registration', async () => {
      const registerDto: RegisterDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@gmail.com",
        mobileNumber: "09172838283",
        password: "password",
        passwordConfirmation: "password",
      };
      
      jest.spyOn(mockPasswordService, 'hashPassword').mockReturnValueOnce(mockUserResponse.password);
  
      jest.spyOn(mockPrismaService.user, 'create').mockRejectedValueOnce(new InternalServerErrorException);
  
      const registerResponse = service.register(registerDto);
  
      await expect(registerResponse).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Login', () => {
    it('findUser > should return a user object', async () => {
      const userEmail = "john.doe@gmail.com";
      jest.spyOn(mockPrismaService.user, 'findFirst').mockReturnValue(mockUserResponse);
      const findUserResponse = await service.findUser(userEmail); 
  
      expect(findUserResponse).toEqual(mockUserResponse);
    });
  
    it('should return a user object and an access token', async () => {
      const loginDto: LoginDto = {
        email: "john.doe@gmail.com",
        password: "password",
      };

      const validLoginMockResponse = {
        user: mockUserResponse,
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibGVicm9uQGdtYWlsLmNvbSIsImlhdCI6MTcxNTY2MzQ1MSwiZXhwIjoxNzE1NjY3MDUxfQ.EJWk7xs5MjhhprjEfE5ySvMGi84klpxHrHLGtlwerTI"
      };

      jest.spyOn(mockPasswordService, 'validatePassword').mockReturnValueOnce(true);

      jest.spyOn(mockJwtService, 'signAsync').mockReturnValueOnce(validLoginMockResponse.access_token);

      const loginResponse = await service.login(loginDto);
  
      expect(loginResponse).toEqual(validLoginMockResponse);
    });

    it('should return an error for invalid login credentials', async () => {
      const loginDto: LoginDto = {
        email: "john.doe@gmail.com",
        password: "password",
      };

      const validLoginMockResponse = {
        user: mockUserResponse,
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibGVicm9uQGdtYWlsLmNvbSIsImlhdCI6MTcxNTY2MzQ1MSwiZXhwIjoxNzE1NjY3MDUxfQ.EJWk7xs5MjhhprjEfE5ySvMGi84klpxHrHLGtlwerTI"
      };

      jest.spyOn(mockPasswordService, 'validatePassword').mockReturnValueOnce(false);

      jest.spyOn(mockJwtService, 'signAsync').mockReturnValueOnce(validLoginMockResponse.access_token);

      const loginResponse = service.login(loginDto);
  
      await expect(loginResponse).rejects.toThrow(UnauthorizedException);
    });
  });

  
});
