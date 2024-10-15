import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { ErrorService } from 'src/core/error/error.service';

@Module({
    controllers: [CategoryController],
    providers: [
        CategoryService,
        PrismaService,
        PrismaClientService,
        ErrorService,
    ],
})
export class CategoryModule {}
