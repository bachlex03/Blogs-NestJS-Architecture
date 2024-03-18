import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserInfo } from './entities/user-info.entity';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.prismaService.user.create({
      data: { ...registerUserDto },
    });

    return user;
  }

  // async findAll(): Promise<User[]> {
  //   return await this.userRepo.find();
  // }

  async findOneById(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    return user;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    // const user = await this.findOneById(id);
    // if (!user) throw new ForbiddenException('User not found !');
    // return await this.userRepo.update(id, updateUserDto);
  }

  // async updatePasswordByEmail(email: string, updateUserDto: UpdateUserDto) {
  //   const options: FindOptionsWhere<User> = {
  //     email,
  //   };

  //   const user = await this.userRepo.findOneBy({ email });

  //   if (!user) throw new NotFoundException('Email not found !');

  //   return await this.userRepo.update(options, {
  //     password: updateUserDto.password,
  //   });
  // }

  // deleteById(id: number) {
  //   return this.userRepo.delete(null);
  // }

  // remove(id: number) {
  //   return this.userRepo.delete(id);
  // }
}
