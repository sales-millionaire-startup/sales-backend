import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import {
  ProductCreateInput,
  ProductUpdateInput,
} from '../models/product.models';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseJsonPipe } from '../../core/parser/parse-json.pipe';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get(':categoryId')
  async getCategoryProducts(
    @Param('categoryId', new ParseIntPipe()) categoryId: number,
  ): Promise<any> {
    return await this.productService.getCategoryProducts(categoryId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('')
  async createProduct(
    @UploadedFile() file,
    @Body('data', ParseJsonPipe) productCreateInput: ProductCreateInput,
  ): Promise<any> {
    return await this.productService.createSingleProduct(
      productCreateInput,
      file,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put(':productId')
  async updateProduct(
    @UploadedFile() file,
    @Param('productId', new ParseIntPipe()) productId,
    @Body('data', ParseJsonPipe) productUpdateInput: ProductUpdateInput,
  ): Promise<any> {
    return await this.productService.updateSingleProduct(
      productUpdateInput,
      productId,
      file,
    );
  }

  @Delete(':productId')
  async deleteProduct(
    @Param('productId', new ParseIntPipe()) productId,
  ): Promise<any> {
    return await this.productService.deleteProduct(productId);
  }
}
