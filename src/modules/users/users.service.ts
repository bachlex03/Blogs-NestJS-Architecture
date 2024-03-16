import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserInfo } from './entities/user-info.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserInfo) private userInfoRepo: Repository<UserInfo>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    console.log({
      registerUserDto,
    });
    const user = this.userRepo.create(registerUserDto);

    const savedUser = await this.userRepo.save(user);

    if (!savedUser) throw new BadRequestException("Can't register user");

    const userInfo = this.userInfoRepo.create({
      user: savedUser,
    });

    const savedInfo = await this.userInfoRepo.save(userInfo);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
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

  deleteById(id: number) {
    return this.userRepo.delete(null);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}
