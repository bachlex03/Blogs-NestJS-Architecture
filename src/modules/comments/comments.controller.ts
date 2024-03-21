import { Controller, Get, Param, Delete, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('comments')
@ApiTags('Comments')
@ApiSecurity('JWT-auth')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  /**
   * [ADMIN, USER] can delete its own comment
   */
  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async delete(@Param('id') id: number, @Req() req: Request) {
    const { userId } = req.user as any;

    return await this.commentsService.delete(userId, id);
  }
}
