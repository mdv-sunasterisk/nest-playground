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

@Module({
  imports: [
    BlogModule, 
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public/images'),
      serveRoot: '/public/images/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, PasswordService, ConfigService],
})

export class AppModule {}
