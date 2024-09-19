import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CartItemCreateInput } from '../models/cart.models';
import { ApiError } from '../../core/api-errors/api-error';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCartItems(cartId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        id: cartId,
      },
    });

    if (!cart) {
      throw new BadRequestException('No cart with such cartId: ' + cartId);
    }

    return await this.prisma.cartItem.findMany({
      where: {
        cartId: cartId,
      },
      include: {
        product: true,
        cartItemValues: {
          include: {
            specification: {
              include: {
                unitElement: true,
              },
            },
          },
        },
      },
    });
  }

  async addCartItem(cartId: number, cartItemCreateInput: CartItemCreateInput) {
    await this.prisma.cartItem.create({
      data: {
        cartId: cartId,
        productId: cartItemCreateInput.productId,
        cartItemValues: {
          create:
            cartItemCreateInput.cartItemValues?.map((itemValue) => ({
              specificationId: itemValue.specificationId,
              value: itemValue.value,
            })) || [],
        },
      },
      include: {
        cartItemValues: true,
      },
    });
  }

  private async validateItemSpecifications(cartItem, cartItemValues) {
    return cartItemValues.every((cartItemValue) =>
      cartItem.product.specifications.some(
        (specification) => specification.id === cartItemValue.specificationId,
      ),
    );
  }

  async removeCartItem(cartId: number, cartItemId: number) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem || cartItem.cartId !== cartId) {
      throw new ApiError(404, 'cart_item_not_found', 'Cart item not found');
    }

    return await this.prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  }
}
