import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { ErrorService } from 'src/core/error/error.service';

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, PrismaClientService, ErrorService],
})
export class UserModule {}
