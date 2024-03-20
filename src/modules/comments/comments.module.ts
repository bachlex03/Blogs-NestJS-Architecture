import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { BlogsModule } from '../blogs/blogs.module';
import { BlogsService } from '../blogs/blogs.service';

@Module({
  imports: [PrismaModule, BlogsModule],
  controllers: [CommentsController],
  providers: [CommentsService, BlogsService],
  exports: [CommentsService],
})
export class CommentsModule {}
