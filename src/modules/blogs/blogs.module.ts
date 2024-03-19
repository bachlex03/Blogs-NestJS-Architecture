import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Comment } from './entities/comment.entity';
import { PrismaModule } from 'prisma/prisma.module';
import { CommentsModule } from '../comments/comments.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Comment]),
    PrismaModule,
    CommentsModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
