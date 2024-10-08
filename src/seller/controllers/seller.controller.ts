import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SellerCategoryInput, SellerInfoInput } from '../models/seller.model';
import { Roles } from 'src/core/common/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/core/common/roles.guard';
import { SellerService } from '../services/seller.service';

@Controller('api/seller')
export class CategoryController {
  constructor(private sellerService: SellerService) {}

  @Get(':id')
  @Roles(Role.SELLER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getSellerInfo(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<any> {
    return await this.sellerService.getSellerInfo(id);
  }

  @Post('category')
  @Roles(Role.SELLER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async setSellingCategories(
    @Body() sellerCategoryInput: SellerCategoryInput,
  ): Promise<any> {
    return await this.sellerService.setSellingCategories(sellerCategoryInput);
  }

  @Put(':id')
  @Roles(Role.SELLER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createCategory(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() sellerInfoInput: SellerInfoInput,
  ): Promise<any> {
    return await this.sellerService.updateSellerInfo(sellerInfoInput, id);
  }
}
