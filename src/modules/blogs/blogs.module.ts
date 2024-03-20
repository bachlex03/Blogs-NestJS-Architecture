import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Comment } from './entities/comment.entity';
import { PrismaModule } from 'prisma/prisma.module';
import { CommentsService } from '../comments/comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Comment]), PrismaModule],
  controllers: [BlogsController],
  providers: [BlogsService, CommentsService],
  exports: [BlogsService],
})
export class BlogsModule {}
