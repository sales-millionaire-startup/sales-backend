import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';

@Module({
    controllers: [CategoryController],
    providers: [CategoryService, PrismaService, PrismaClientService],
})
export class CategoryModule {}
