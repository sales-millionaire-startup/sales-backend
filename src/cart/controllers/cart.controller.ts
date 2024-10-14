/* eslint-disable prettier/prettier */
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
import { CartService } from '../services/cart.service';
import { CartItemCreateInput, CartItemUpdateInput } from '../models/cart.models';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseJsonPipe } from 'src/core/parser/parse-json.pipe';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/core/common/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/core/common/roles.decorator';

@Controller('api/cart')
export class CartController {
    constructor(private cartService: CartService) {}

  @Get(':cartId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER, Role.ADMIN)
    async getCartItems(
    @Param('cartId', new ParseIntPipe()) cartId: number,
    ): Promise<any> {
        return await this.cartService.getCartItems(cartId);
    }

  @UseInterceptors(FileInterceptor('file'))
  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER, Role.ADMIN)
  async addCartItem(
    @UploadedFile() file,
    @Body() cartItemCreateInput: CartItemCreateInput,
  ): Promise<any> {
      return await this.cartService.addCartItem(cartItemCreateInput, file);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put(':cartItemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER, Role.ADMIN)
  async uploadImageForCartItem(
    @UploadedFile() file,
    @Param('cartItemId', new ParseIntPipe()) cartItemId: number,
    @Body('data', ParseJsonPipe) cartItemUpdateInput: CartItemUpdateInput,
  ): Promise<any> {
      return await this.cartService.updateCartItem(cartItemId, cartItemUpdateInput, file);
  }

  @Delete(':cartId/:cartItemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER, Role.ADMIN)
  async removeCartItem(
    @Param('cartId', new ParseIntPipe()) cartId: number,
    @Param('cartItemId', new ParseIntPipe()) cartItemId: number,
  ): Promise<any> {
      return await this.cartService.removeCartItem(cartId, cartItemId);
  }
}
