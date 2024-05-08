import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [BlogModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
