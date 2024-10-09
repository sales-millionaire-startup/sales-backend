import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import {
  userBuyerIncludes,
  userSellerIncludes,
} from '../prisma-helpers/user-prisma.helpers';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let includes = {};

    if (user.role === Role.BUYER) {
      includes = userBuyerIncludes;
    } else if (user.role === Role.SELLER) {
      includes = userSellerIncludes;
    }

    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: includes,
    });
  }
}
