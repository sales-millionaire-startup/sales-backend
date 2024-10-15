import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { SellerController } from './controllers/seller.controller';
import { SellerService } from './services/seller.service';

@Module({
    controllers: [SellerController],
    providers: [SellerService, PrismaService, PrismaClientService],
})
export class SellerModule {}
