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
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import {
    ProductCreateInput,
    ProductUpdateInput,
} from '../models/product.models';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseJsonPipe } from '../../core/parser/parse-json.pipe';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/core/common/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/core/common/roles.decorator';

@Controller('api/product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get(':categoryId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.BUYER, Role.ADMIN)
    async getCategoryProducts(
        @Param('categoryId', new ParseIntPipe()) categoryId: number,
    ): Promise<any> {
        return await this.productService.getCategoryProducts(categoryId);
    }

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createProduct(
        @UploadedFile() file,
        @Body('data', ParseJsonPipe) productCreateInput: ProductCreateInput,
    ): Promise<any> {
        return await this.productService.createSingleProduct(
            productCreateInput,
            file,
        );
    }

    @Put(':productId')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async deleteProduct(
        @Param('productId', new ParseIntPipe()) productId,
    ): Promise<any> {
        return await this.productService.deleteProduct(productId);
    }
}
