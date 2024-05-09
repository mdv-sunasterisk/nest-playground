import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    /**
     * Registers a new user.
    *
    * @param {RegisterDto} registerDto - The data for user registration.
    * @returns {Promise<User>} The newly created user.
    */
    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<User> {
        return this.authService.register(registerDto);
    }

    
    /**
     * Authenticates a user with the provided login credentials.
    *
    * @param {LoginDto} loginDto - The login credentials of the user.
    * @return {Promise<{ user: User, access_token: string }>} - The authenticated user and access token.
    * @throws {NotFoundException} - If the user is not found or the credentials are incorrect.
    */
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<{ user: User, access_token: string }> {
        return this.authService.login(loginDto);
    }
}