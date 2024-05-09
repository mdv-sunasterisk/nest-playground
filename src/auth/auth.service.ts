import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService, 
        private password: PasswordService, 
        private jwt: JwtService
    ) {}

    /**
     * User registration.
     * 
     * @param {RegisterDto} registerDto - The data for user registration.
     * @returns {Promise<User>} The newly created user.
     */
    async register(registerDto: RegisterDto): Promise<User> {
        const hashedPassword = await this.password.hashPassword(registerDto.password);

        return this.prisma.user.create({
            data: {
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
                email: registerDto.email,
                mobileNumber: registerDto.mobileNumber,
                password: hashedPassword 
            }
        });
    }
    
    /**
     * Retrieves a user based on the provided email.
     *
     * @param {string} email - The email of the user to find.
     * @returns {Promise<User|null>} The user found with the provided email, or null if not found.
     */
    async findUser(email: string): Promise<User|null> {
        return this.prisma.user.findFirst({
            where: {
                email: email
            }
        });
    }
    
    /**
     * Authenticates a user with the provided login credentials.
     *
     * @param {LoginDto} loginDto - The login credentials of the user.
     * @return {Promise<{ user: User, access_token: string }>} - The authenticated user and access token.
     * @throws {NotFoundException} - If the user is not found or the credentials are incorrect.
     */
    async login(loginDto: LoginDto): Promise<{ user: User, access_token: string }> {
        const user = await this.findUser(loginDto.email);

        if(user) {
            const isValid = await this.password.validatePassword(loginDto.password, user.password);

            if(isValid) {
                const payload = {
                    sub: user.id,
                    email: user.email
                }

                const jwtToken = await this.jwt.signAsync(payload);

                return { 
                    user: user,
                    access_token: jwtToken 
                };
            } else {
                throw new NotFoundException('Incorrect credentials.');
            }
        }
        
        throw new NotFoundException('Incorrect credentials.');
    }
}
