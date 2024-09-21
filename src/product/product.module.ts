import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { FileService } from 'src/core/files/fileService';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, PrismaClientService, FileService],
})
export class ProductModule {}
