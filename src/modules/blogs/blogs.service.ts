import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Blog } from '.prisma/client';
import { Status as StatusPrisma } from '@prisma/client';
import { StatusEnum } from 'src/common/enums/blog-status.enum';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BlogsService {
  constructor(
    private prismaService: PrismaService,
    private commentService: CommentsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findById(blogId: number) {
    return await this.prismaService.blog.findFirst({ where: { id: blogId } });
  }

  async requestCreate(
    userId: string,
    createBlogDto: CreateBlogDto,
  ): Promise<Blog> {
    const blog = await this.prismaService.blog.create({
      data: { ...createBlogDto, authorId: userId },
    });

    if (!blog) {
      throw new BadRequestException('Can not create blog');
    }

    return blog;
  }

  async commentOnBlog(createCommentDto: CreateCommentDto) {
    const comment = await this.commentService.create(createCommentDto);

    if (!comment) throw new BadRequestException('Can not on this blog');

    this.eventEmitter.emit('comment', {
      authorComment: createCommentDto.authorId,
      content: createCommentDto.content,
      blogId: createCommentDto.blogId,
      authorBlog: (await this.findById(createCommentDto.blogId)).authorId,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Commented',
    };
  }

  async findAllByStatus(status: StatusEnum): Promise<Blog[]> {
    if (status == StatusEnum.ALL) {
      return await this.prismaService.blog.findMany();
    }

    return await this.prismaService.blog.findMany({
      where: {
        status,
      },
    });
  }

  async findApprovedBlogs(): Promise<any[]> {
    const blogs = await this.prismaService.blog.findMany({
      select: {
        title: true,
        content: true,
        createAt: true,
        author: {
          select: {
            name: true,
          },
        },
        comments: {
          select: {
            comment: {
              select: {
                author: {
                  select: {
                    name: true,
                  },
                },
                createAt: true,
                content: true,
              },
            },
          },
        },
      },
      where: { status: StatusEnum.APPROVED },
    });

    return blogs.map((blog) => {
      const cmts = blog.comments.map((cmt) => {
        return {
          author: cmt.comment.author.name,
          content: cmt.comment.content,
          createAt: cmt.comment.createAt,
        };
      });

      return {
        ...blog,
        comments: cmts,
      };
    });
  }

  async blogActions(blogId: number, action: StatusPrisma) {
    const blog = await this.prismaService.blog.update({
      where: { id: blogId },
      data: {
        status: action,
      },
    });

    if (!blog) {
      throw new BadRequestException("Can't approve blog");
    }

    return {
      message: 'Approved !',
      statusCode: HttpStatus.OK,
    };
  }

  async requestDelete(blogId: number, userId: string) {
    return await this.prismaService.blog.update({
      where: {
        id: blogId,
        authorId: userId,
      },
      data: {
        status: StatusPrisma.PENDING_DELETION,
      },
    });
  }

  async delete(blogId: number) {
    try {
      const blog = await this.prismaService.blog.delete({
        where: {
          id: blogId,
          status: StatusPrisma.PENDING_DELETION,
        },
      });

      if (!blog) {
        throw new BadRequestException('Blog is not in pending deletion');
      }

      await this.commentService.deleteCommentsNotBelongToBlog();

      return {
        message: 'Delete successful',
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException('Something went wrong when delete');
    }
  }
}
