import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { KeyToken } from './entities/key-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveKeyTokenDto } from './dto/save-key-token.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class KeyTokenService {
  constructor(
    @InjectRepository(KeyToken)
    private readonly keyTokenRepository: Repository<KeyToken>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, saveKeyTokenDto: SaveKeyTokenDto) {
    const user = await this.usersService.findOneById(userId);

    if (!user) throw new BadRequestException('User not found !');

    let keyToken = await this.keyTokenRepository.findOne({ where: { user } });

    if (keyToken) {
      keyToken.refreshTokenUsing = saveKeyTokenDto.refreshTokenUsing;
      keyToken.refreshTokenUsed = saveKeyTokenDto.refreshTokenUsed;
    } else {
      keyToken = this.keyTokenRepository.create({
        user: user,
        ...saveKeyTokenDto,
      });
    }

    return await this.keyTokenRepository.save(keyToken);
  }
}