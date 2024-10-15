import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { PurchaseRequestController } from './controllers/purchaseRequest.controller';
import { PurchaseRequestService } from './services/purchaseRequest.service';
import { ErrorService } from 'src/core/error/error.service';

@Module({
    controllers: [PurchaseRequestController],
    providers: [
        PurchaseRequestService,
        PrismaService,
        PrismaClientService,
        ErrorService,
    ],
})
export class PurchaseRequestModule {}
