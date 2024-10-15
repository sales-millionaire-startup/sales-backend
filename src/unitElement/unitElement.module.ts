import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { UnitElementService } from './services/unitElement.service';
import { UnitElementController } from './controllers/unitElement.controller';
import { ErrorService } from 'src/core/error/error.service';

@Module({
    controllers: [UnitElementController],
    providers: [
        UnitElementService,
        PrismaService,
        PrismaClientService,
        ErrorService,
    ],
})
export class UnitElementModule {}
