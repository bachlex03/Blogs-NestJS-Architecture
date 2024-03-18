import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Request } from 'express';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
@ApiTags('Users')
@ApiSecurity('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * [ADMIN] Get all users
   */
  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.usersService.findAll();
  }

  /**
   * [ADMIN] Get user by user id
   */
  @Get(':id')
  @Roles(Role.ADMIN)
  async findOneById(@Param('id') id: string) {
    return await this.usersService.findOneById(id);
  }

  /**
   * [USER] can change own password
   */
  @Patch('me/password')
  @Roles(Role.USER)
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: Request,
  ) {
    const { userId } = req.user as any;

    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  /**
   * [ADMIN] can reset password of user
   */
  @Patch(':id/password')
  @Roles(Role.ADMIN)
  changePassword(@Param('id') id: string) {
    return this.usersService.resetPassword(id);
  }

  /**
   * [ADMIN] can delete user
   */
  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.usersService.deleteById(id);
  }
}
