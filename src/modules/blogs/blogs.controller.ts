import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Query,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Request } from 'express';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { StatusDto } from './dto/status.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { BlogActionsDto } from './dto/actions.dto';

@Controller('blogs')
@ApiTags('Blogs')
@ApiSecurity('JWT-auth')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  /**
   * [VIEWER] Can see all blogs that is approved (done)
   */
  @Public()
  @Get('/viewer')
  async findApprovedBlogs() {
    return await this.blogsService.findApprovedBlogs();
  }

  /**
   * [ADMIN] Can find all blogs with query ?status (done)
   */
  @Get()
  @Roles(Role.ADMIN)
  async findAllByStatus(@Query() query: StatusDto) {
    return await this.blogsService.findAllByStatus(query.status);
  }

  /**
   * [ADMIN, USER] Can create blog but ADMIN must approve user'blog (done)
   */
  @Post()
  @Roles(Role.ADMIN, Role.USER)
  async requestCreate(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: Request,
  ) {
    const { userId } = req.user as any;

    return await this.blogsService.requestCreate(userId, createBlogDto);
  }

  /**
   * [ADMIN, USER] Can comment a blog (done)
   */
  @Post(':blogId/comment')
  @Roles(Role.ADMIN, Role.USER)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
        },
      },
    },
  })
  async commentOnBlog(
    @Param('blogId') blogId: number,
    @Req() req: Request,
    @Body('content') content: string,
  ) {
    if (!content) throw new BadRequestException('Comment do not empty !');

    const { userId } = req.user as any;

    return await this.blogsService.commentOnBlog({
      blogId,
      authorId: userId,
      content,
    });
  }

  /**
   * [ADMIN] approve or delete blogs (done)
   */
  @Patch(':id')
  @Roles(Role.ADMIN)
  async blogActions(@Query() query: BlogActionsDto, @Param('id') id: number) {
    return await this.blogsService.blogActions(id, query.action);
  }

  /**
   * [ADMIN, USER] Can delete blog but ADMIN must approve user'blog (done)
   */
  @Patch(':id/requestDelete')
  @Roles(Role.ADMIN, Role.USER)
  async requestDelete(@Param('id') id: number, @Req() req: Request) {
    const { userId } = req.user as any;

    return await this.blogsService.requestDelete(id, userId);
  }

  /**
   * [ADMIN] Approve delete request from user (done)
   */
  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: number) {
    return await this.blogsService.delete(id);
  }
}
