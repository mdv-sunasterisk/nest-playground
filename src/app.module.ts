import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PasswordService } from './password/password.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from 'config/jwt.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import redisConfig from 'config/redis.config';
import mailConfig from 'config/mail.config';
import generalConfig from 'config/general.config';

@Module({
  imports: [
    BlogModule, 
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, redisConfig, mailConfig, generalConfig]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public/images'),
      serveRoot: '/public/images/',
    }),
    // Todo: useFactory settings have to be more dynamic somehow.
    BullModule.forRootAsync({
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
  controllers: [AppController],
  providers: [AppService, PrismaService, PasswordService, ConfigService, MailService],
})

export class AppModule {}
