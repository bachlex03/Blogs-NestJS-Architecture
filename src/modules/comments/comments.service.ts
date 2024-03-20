import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BlogsService } from '../blogs/blogs.service';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(forwardRef(() => BlogsService)) private blogsService: BlogsService,
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll() {
    return await this.prismaService.comment.findMany();
  }

  async findComment(id: number) {
    const comment = await this.prismaService.comment.findFirst({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async findAllCommentsOfBlog(blogId: number) {
    return await this.prismaService.comment.findMany({
      where: { blogs: { some: { blogId: blogId } } },
    });
  }

  async findAllCommentsOfUser(userId: string) {
    return await this.prismaService.comment.findMany({
      where: { author: { id: userId } },
    });
  }

  async create(createCommentDto: CreateCommentDto): Promise<any> {
    const userComment = this.prismaService.comment.create({
      data: {
        content: createCommentDto.content,
        authorId: createCommentDto.authorId,
      },
    });

    const commentOnBlog = this.prismaService.commentsOnBlogs.create({
      data: {
        blogId: createCommentDto.blogId,
        commentId: (await userComment).id,
      },
    });

    const transaction = await this.prismaService.$transaction([
      userComment,
      commentOnBlog,
    ]);

    return {
      commentId: transaction[0].id,
      content: transaction[0].content,
      blogId: transaction[1].blogId,
    };
  }

  async commentOnBlog(createCommentDto: CreateCommentDto) {
    const comment = await this.create(createCommentDto);

    if (!comment) throw new BadRequestException('Can not on this blog');

    this.eventEmitter.emit('comment', {
      authorComment: createCommentDto.authorId,
      content: createCommentDto.content,
      blogId: createCommentDto.blogId,
      authorBlog: (await this.blogsService.findById(createCommentDto.blogId))
        .authorId,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Commented',
    };
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

  async delete(id: number) {
    const comment = await this.prismaService.comment.delete({ where: { id } });

    if (!comment) {
      throw new BadGatewayException("Can't delete this comment");
    }

    return {
      message: 'Deleted comment !',
      statusCode: HttpStatus.OK,
    };
  }
}
