import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveTokenDto } from './dto/save-token.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly TokenRepo: Repository<Token>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, saveTokenDto: SaveTokenDto) {
    const user = await this.usersService.findOneById(userId);

    if (!user) throw new BadRequestException('User not found !');

    let token = await this.TokenRepo.findOne({ where: { user } });

    if (token) {
      token.accessToken = saveTokenDto.accessToken;
      token.refreshToken = saveTokenDto.refreshToken;
      token.refreshTokenUsed = saveTokenDto.refreshTokenUsed;
    } else {
      token = this.TokenRepo.create({
        user: user,
        ...saveTokenDto,
      });
    }
    return await this.TokenRepo.save(token);
  }

  async update(token: Token) {
    return this.TokenRepo.save(token);
  }

  async findTokenUsed(refreshToken: string): Promise<Token> {
    return await this.TokenRepo.findOne({
      where: { refreshTokenUsed: refreshToken },
    });
  }

  async findByTokenUsing(refreshToken: string): Promise<Token> {
    return await this.TokenRepo.findOne({
      where: { refreshToken },
      relations: ['user'],
    });
  }

  async getAccessToken(accessToken: string): Promise<Token> {
    return await this.TokenRepo.findOne({
      where: { accessToken },
      relations: ['user'],
    });
  }

  async deleteByUserId(userId: string) {
    return await this.TokenRepo.createQueryBuilder()
      .delete()
      .from(Token)
      .where('user = :userId', { userId })
      .execute();
  }
}
