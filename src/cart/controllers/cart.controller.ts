import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { CartItemCreateInput } from '../models/cart.models';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get(':cartId')
  async getCartItems(
    @Param('cartId', new ParseIntPipe()) cartId: number,
  ): Promise<any> {
    return await this.cartService.getCartItems(cartId);
  }

  @Post(':cartId')
  async addCartItem(
    @Param('cartId', new ParseIntPipe()) cartId: number,
    @Body() cartItemCreateInput: CartItemCreateInput,
  ): Promise<any> {
    return await this.cartService.addCartItem(cartId, cartItemCreateInput);
  }

  @Delete(':cartId/:cartItemId')
  async removeCartItem(
    @Param('cartId', new ParseIntPipe()) cartId: number,
    @Param('cartItemId', new ParseIntPipe()) cartItemId: number,
  ): Promise<any> {
    return await this.cartService.removeCartItem(cartId, cartItemId);
  }
}
