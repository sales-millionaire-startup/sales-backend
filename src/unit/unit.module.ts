import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { UnitController } from './controllers/unit.controller';
import { UnitService } from './services/unit.service';

@Module({
  controllers: [UnitController],
  providers: [UnitService, PrismaService, PrismaClientService],
})
export class UnitModule {}
