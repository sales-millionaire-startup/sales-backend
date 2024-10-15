import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { SellerController } from './controllers/seller.controller';
import { SellerService } from './services/seller.service';
import { ErrorService } from 'src/core/error/error.service';

@Module({
    controllers: [SellerController],
    providers: [
        SellerService,
        PrismaService,
        PrismaClientService,
        ErrorService,
    ],
})
export class SellerModule {}
