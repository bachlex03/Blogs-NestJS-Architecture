import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);

    if (!user) throw new ForbiddenException('User not found !');

    return await this.userRepository.update(id, updateUserDto);
  }

  async updatePasswordByEmail(email: string, updateUserDto: UpdateUserDto) {
    const options: FindOptionsWhere<User> = {
      email,
    };

    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new ForbiddenException('Email not found !');

    return this.userRepository.update(options, {
      password: updateUserDto.password,
    });
  }

  deleteById(id: number) {
    return this.userRepository.delete(id);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
