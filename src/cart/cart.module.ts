import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { FileService } from 'src/core/files/fileService';
import { ErrorService } from 'src/core/error/error.service';

@Module({
    controllers: [CartController],
    providers: [
        CartService,
        PrismaService,
        PrismaClientService,
        FileService,
        ErrorService,
    ],
})
export class CartModule {}
