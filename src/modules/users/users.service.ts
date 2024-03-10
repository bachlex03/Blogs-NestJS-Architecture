import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  Repository,
  FindOneOptions,
  UpdateOptions,
  FindOptionsWhere,
} from 'typeorm';

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

  findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  updateByEmail(email: string, updateUserDto: UpdateUserDto) {
    const options: FindOptionsWhere<User> = {
      email,
    };

    return this.userRepository.update(options, updateUserDto);
  }

  deleteById(id: number) {
    return this.userRepository.delete(id);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
