import { Controller, Get, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('Comments')
@ApiSecurity('JWT-auth')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
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
   * [ADMIN, USER] can delete its own comment through param :userId
   */
  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async delete(@Param(':id') id: number) {
    return await this.commentsService.delete(id);
  }
}
