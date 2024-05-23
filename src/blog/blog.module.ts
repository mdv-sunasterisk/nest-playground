import { BadRequestException, Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
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
    MulterModule.registerAsync({
      useFactory: async () => ({
        storage: diskStorage({
          destination: './public/images',
          filename: (req, file, callback) => {
            const uniqueKey = uuidv4();
            const newFileName = uniqueKey + extname(file.originalname);
            callback(null, newFileName);
          },
        }),
        fileFilter: (req, file, cb) => {
          const validMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
          if(!validMimeTypes.includes(file.mimetype)) {
            return cb(new BadRequestException('Image upload should only be of the file types jpg,jpeg,png.'), false);
          }

          cb(null, true);
        },
        limits: { fileSize: 1 * 1024 * 1024 }
      })
    })
  ],
  controllers: [BlogController],
  providers: [BlogService, PrismaService]
})
export class BlogModule {}
