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
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { CartItemCreateInput, CartItemUpdateInput, CartItemValue } from '../models/cart.models';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseJsonPipe } from 'src/core/parser/parse-json.pipe';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get(':cartId')
  async getCartItems(
    @Param('cartId', new ParseIntPipe()) cartId: number,
  ): Promise<any> {
    return await this.cartService.getCartItems(cartId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('')
  async addCartItem(
    @UploadedFile() file,
    @Body() cartItemCreateInput: CartItemCreateInput,
  ): Promise<any> {
    return await this.cartService.addCartItem(cartItemCreateInput, file);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put(':cartItemId')
  async uploadImageForCartItem(
    @UploadedFile() file,
    @Param('cartItemId', new ParseIntPipe()) cartItemId: number,
    @Body('data', ParseJsonPipe) cartItemUpdateInput: CartItemUpdateInput,
  ): Promise<any> {
    return await this.cartService.updateCartItem(cartItemId, cartItemUpdateInput, file);
  }

  @Delete(':cartId/:cartItemId')
  async removeCartItem(
    @Param('cartId', new ParseIntPipe()) cartId: number,
    @Param('cartItemId', new ParseIntPipe()) cartItemId: number,
  ): Promise<any> {
    return await this.cartService.removeCartItem(cartId, cartItemId);
  }
}
