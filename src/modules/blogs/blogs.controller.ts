import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Request } from 'express';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { StatusDto } from './dto/status.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { StatusEnum } from 'src/common/enums/blog-status.enum';
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
  async create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
    return await this.blogsService.create(req, createBlogDto);
  }

  /**
   * [ADMIN] approve or delete blogs (done)
   */
  @Patch(':blogId')
  @Roles(Role.ADMIN)
  async blogActions(
    @Query() query: BlogActionsDto,
    @Param('blogId') blogId: number,
  ) {
    return await this.blogsService.blogActions(blogId, query.action);
  }
}
