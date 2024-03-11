import { Injectable } from '@nestjs/common';
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

  async create(saveKeyTokenDto: SaveKeyTokenDto) {
    const user = await this.usersService.findOneById(saveKeyTokenDto.user_id);

    const keyToken = new KeyToken();
    keyToken.user = user;
    keyToken.refreshTokenUsing = saveKeyTokenDto.refreshTokenUsing;

    return this.keyTokenRepository.save(keyToken);
  }
}
