import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BlogsService } from '../blogs/blogs.service';

@Controller('comments')
@ApiTags('Comments')
@ApiSecurity('JWT-auth')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * [ADMIN] can find all comments
   */
  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.commentsService.findAll();
  }

  /**
   * [ADMIN] can find specific comment through param :id
   */
  @Get(':id')
  @Roles(Role.ADMIN)
  async findComment(@Param('id') id: number) {
    return await this.commentsService.findComment(id);
  }

  /**
   * [ADMIN] can find all comments of blog through param :blogId
   * @param blogId
   */
  @Get(':blogId')
  @Roles(Role.ADMIN)
  async findAllCommentsOfBlog(@Param('blogId') blogId: number) {
    return await this.commentsService.findAllCommentsOfBlog(blogId);
  }

  /**
   * [ADMIN] can find all comments of user through param :userId
   */
  @Get(':userId')
  @Roles(Role.ADMIN)
  async findAllCommentsOfUser(@Param('userId') userId: string) {
    return await this.commentsService.findAllCommentsOfUser(userId);
  }

  /**
   * [ADMIN, USER] Can comment a blog (done)
   */
  @Post(':blogId')
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

    return await this.commentsService.commentOnBlog({
      blogId,
      authorId: userId,
      content,
    });
  }

  /**
   * [ADMIN, USER] can delete its own comment through param :userId
   */
  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async delete(@Param(':id') id: number) {
    return await this.commentsService.delete(id);
  }
}
