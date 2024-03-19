import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '.prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prismaService: PrismaService) {}

  create(user: User) {
    const profile = this.prismaService.profile.create({
      data: {
        userId: user.id,
      },
    });

    return 'This action adds a new profile';
  }
}
