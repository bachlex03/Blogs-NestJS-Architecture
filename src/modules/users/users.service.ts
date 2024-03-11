import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    console.log({
      registerUserDto,
    });
    const user = this.userRepository.create(registerUserDto);

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);

    if (!user) throw new ForbiddenException('User not found !');

    return await this.userRepository.update(id, updateUserDto);
  }

  // async updatePasswordByEmail(email: string, updateUserDto: UpdateUserDto) {
  //   const options: FindOptionsWhere<User> = {
  //     email,
  //   };

  //   const user = await this.userRepository.findOneBy({ email });

  //   if (!user) throw new NotFoundException('Email not found !');

  //   return await this.userRepository.update(options, {
  //     password: updateUserDto.password,
  //   });
  // }

  deleteById(id: number) {
    return this.userRepository.delete(id);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
