import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/password/password.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AuthEmailConsumer } from './auth-email.processor';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    // Needs to be set dynamically somehow.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwtSecret'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'authEmail',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redisHost'),
          port: configService.get('redisPort')
        }
      }),
      inject: [ConfigService]
    }),
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, PasswordService, AuthEmailConsumer]
})
export class AuthModule {}
