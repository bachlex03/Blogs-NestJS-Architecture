import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  async create(createCommentDto: CreateCommentDto): Promise<any> {
    const userComment = await this.prismaService.comment.create({
      data: {
        content: createCommentDto.content,
        authorId: createCommentDto.authorId,
      },
    });

    const commentOnBlog = await this.prismaService.commentsOnBlogs.create({
      data: {
        blogId: createCommentDto.blogId,
        commentId: userComment.id,
      },
    });

    return commentOnBlog;
  }

  async deleteCommentsNotBelongToBlog() {
    const comments = await this.prismaService.commentsOnBlogs.findMany({
      select: { commentId: true },
    });

    const deleteCmt = comments.map((cmt) => {
      return {
        id: cmt.commentId,
      };
    });

    await this.prismaService.comment.deleteMany({
      where: { NOT: [...deleteCmt] },
    });
  }
}
