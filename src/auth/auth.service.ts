import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService, 
        private readonly password: PasswordService, 
        private readonly jwt: JwtService,
        @InjectQueue('authEmail') private readonly authEmailQueue: Queue
    ) {}

    async sendVerificationEmail(email: string, token: string) {
        await this.authEmailQueue.add('sendEmail', { email, token });
    }

    /**
     * User registration.
     * 
     * @param {RegisterDto} registerDto - The data for user registration.
     * @returns {Promise<User>} The newly created user.
     */
    async register(registerDto: RegisterDto): Promise<User> {
        const hashedPassword = await this.password.hashPassword(registerDto.password);

        const createdUser = await this.prisma.user.create({
            data: {
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
                email: registerDto.email,
                mobileNumber: registerDto.mobileNumber,
                password: hashedPassword 
            }
        });

        if(createdUser) {
            const token = await this.jwt.signAsync({ email: createdUser.email });
    
            await this.sendVerificationEmail(createdUser.email, token);
        }

        return createdUser;
    }
    
    /**
     * Retrieves a user based on the provided email.
     *
     * @param {string} email - The email of the user to find.
     * @returns {Promise<User|null>} The user found with the provided email, or null if not found.
     */
    async findUser(email: string): Promise<User|null> {
        return this.prisma.user.findUnique({ where: { email } });
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
                throw new UnauthorizedException('Incorrect credentials.');
            }
        }
        
        throw new UnauthorizedException('Incorrect credentials.');
    }

    /**
     * Verifies email based on the provided token from the link.
     *
     * @param {string} token - The login credentials of the user.
     * @return {Promise<void>} - The authenticated user and access token.
     * @throws {BadRequestException} - If the user is not found or the token is invalid.
     */
    async verifyEmail(token: string): Promise<void> {
        try {
            const payload = await this.jwt.verifyAsync(token);
            const email = payload.email;

            const user = await this.prisma.user.findUnique({ where: { email } });

            if(!user) {
                throw new BadRequestException('User does not exist.');
            }

            if(user.emailVerifiedAt) {
                throw new BadRequestException('Email is already verified.');
            }
            
            await this.prisma.user.update({ 
                where: { email },
                data: { emailVerifiedAt: new Date().toISOString() }
            });
            
        } catch (error) {
            throw new BadRequestException(error?.message ?? 'Invalid token.');
        }
    }
}
