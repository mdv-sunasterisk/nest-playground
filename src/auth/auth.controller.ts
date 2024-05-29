import { Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    /**
     * Registers a new user.
    *
    * @param {RegisterDto} registerDto - The data for user registration.
    * @returns {Promise<UserResponseDto>} The newly created user.
    */
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
        return this.authService.register(registerDto);
    }

    /**
     * Authenticates a user with the provided login credentials.
    *
    * @param {LoginDto} loginDto - The login credentials of the user.
    * @return {Promise<{ user: User, access_token: string }>} - The authenticated user and access token.
    * @throws {NotFoundException} - If the user is not found or the credentials are incorrect.
    */
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('login')
    async login(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<{ user: UserResponseDto, access_token: string }> {
        return this.authService.login(loginDto);
    }

    /**
     * Verifies email based on the provided token from the link.
     *
     * @param {string} token - The login credentials of the user.
     * @return {Promise<void>} - The authenticated user and access token.
     * @throws {BadRequestException} - If the user is not found or the token is invalid.
     */
    @Get('verify-email')
    async verifyEmail(@Query('token') token: string): Promise<void> {
        return this.authService.verifyEmail(token);
    }
}