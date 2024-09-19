import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        cart: {
          include: {
            cartItems: {
              include: {
                cartItemValues: {
                  include: {
                    specification: {
                      include: {
                        unitElement: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
