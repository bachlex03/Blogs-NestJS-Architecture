import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    // return this.usersService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    // return this.usersService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateById(id, updateUserDto);
  }

  // @Patch('email/:email')
  // updatePasswordByEmail(
  //   @Param('email') email: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.usersService.updatePasswordByEmail(email, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    // return this.usersService.deleteById(+id);
  }
}
