// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../models/auth.dto';
import { LoginDto } from '../models/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Role } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    if (dto.role !== Role.BUYER && dto.role !== Role.SELLER) {
      throw new BadRequestException('Role must be either SELLER or BUYER');
    }

    const user = await this.createUserEntities(dto);

    return this.generateToken(user);
  }

  private async createUserEntities(dto: AuthDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const transactionResult = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          role: dto.role,
        },
      });

      if (dto.role === Role.BUYER) {
        await tx.cart.create({
          data: {
            userId: user.id,
          },
        });
      }

      return user;
    });

    return transactionResult;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(userId: number) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async createAdmin(data: AuthDto, currentUser: User) {
    if (currentUser.role !== Role.ADMIN) {
      throw new BadRequestException('Only an admin can create another admin.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: Role.ADMIN,
      },
    });

    return user;
  }
}
