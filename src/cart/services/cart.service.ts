import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CartItemCreateInput } from '../models/cart.models';
import { ApiError } from '../../core/api-errors/api-error';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCartItems(cartId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cartId,
      },
      include: {
        product: {
          include: {
            specifications: {
              include: {
                unitElement: true,
              },
            },
          },
        },
        specification: {
          include: {
            unitElement: true,
          },
        },
      },
    });

    // Format the response to nest specifications and include the value
    const formattedCartItems = cartItems.map((cartItem) => ({
      id: cartItem.id,
      product: {
        id: cartItem.product.id,
        name_en: cartItem.product.name_en,
        name_ge: cartItem.product.name_ge,
        name_tr: cartItem.product.name_tr,
        specifications: cartItem.product.specifications.map((spec) => ({
          id: spec.id,
          name_en: spec.name_en,
          name_ge: spec.name_ge,
          name_tr: spec.name_tr,
          unitElement: spec.unitElement,
          value: cartItem.specification.id === spec.id ? cartItem.value : null,
        })),
      },
    }));

    return formattedCartItems;
  }

  async addCartItem(cartId: number, cartItemCreateInput: CartItemCreateInput) {
    return await this.prisma.cartItem.create({
      data: {
        cartId: cartId,
        productId: cartItemCreateInput.productId,
        specificationId: cartItemCreateInput.specificationId,
        value: cartItemCreateInput.value,
      },
    });
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
