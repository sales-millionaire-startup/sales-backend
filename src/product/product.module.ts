import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, PrismaClientService],
})
export class ProductModule {}
