import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import {
  ProductCreateInput,
  ProductUpdateInput,
} from '../models/product.models';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get(':categoryId')
  async getCategoryProducts(
    @Param('categoryId', new ParseIntPipe()) categoryId: number,
  ): Promise<any> {
    return await this.productService.getCategoryProducts(categoryId);
  }

  @Post('')
  async createProduct(
    @Body() productCreateInput: ProductCreateInput,
  ): Promise<any> {
    return await this.productService.createSingleProduct(productCreateInput);
  }

  @Put(':productId')
  async updateProduct(
    @Param('productId', new ParseIntPipe()) productId,
    @Body() productUpdateInput: ProductUpdateInput,
  ): Promise<any> {
    return await this.productService.updateSingleProduct(
      productUpdateInput,
      productId,
    );
  }

  @Delete(':productId')
  async deleteProduct(
    @Param('productId', new ParseIntPipe()) productId,
  ): Promise<any> {
    return await this.productService.deleteProduct(productId);
  }
}
