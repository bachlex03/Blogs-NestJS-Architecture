import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Blog } from '.prisma/client';
import { Status as StatusPrisma } from '@prisma/client';
import { StatusEnum } from 'src/common/enums/blog-status.enum';
import { BlogActionsDto } from './dto/actions.dto';

@Injectable()
export class BlogsService {
  constructor(private prismaService: PrismaService) {}

  async create(req: any, createBlogDto: CreateBlogDto): Promise<Blog> {
    const { userId } = req.user;

    const blog = await this.prismaService.blog.create({
      data: { ...createBlogDto, authorId: userId },
    });

    if (!blog) {
      throw new BadRequestException('Can not create blog');
    }

    return blog;
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

  async findApprovedBlogs(): Promise<Blog[]> {
    return await this.prismaService.blog.findMany({
      where: { status: StatusEnum.APPROVED },
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
}
