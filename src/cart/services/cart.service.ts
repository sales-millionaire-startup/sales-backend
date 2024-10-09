import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CartItemCreateInput,
  CartItemUpdateInput,
} from '../models/cart.models';
import { ApiError } from '../../core/api-errors/api-error';
import { FileService } from 'src/core/files/fileService';
import { cartItemIncludes } from '../prisma-helpers/cart-prisma-helpers';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

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
      include: cartItemIncludes,
    });
  }

  async addCartItem(cartItemCreateInput: CartItemCreateInput, file) {
    const imageName = await this.fileService.uploadFile(file);
    await this.prisma.cartItem.create({
      data: {
        cartId: cartItemCreateInput.cartId,
        productId: cartItemCreateInput.productId,
        imageName: imageName,
        imageUrl: process.env.IMAGE_URL + imageName,
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

  async updateCartItem(
    cartItemId: number,
    cartItemUpdateInput: CartItemUpdateInput,
    file,
  ) {
    // Fetch the existing cart item
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      include: {
        cartItemValues: true, // To include cart item values in the response
      },
    });

    if (!cartItem) {
      throw new ApiError(404, 'not_found', 'Cart item not found');
    }

    // Handle file upload if a new file is provided or if imageName has changed
    let imageName = cartItem.imageName;
    if (file || cartItemUpdateInput.imageName !== cartItem.imageName) {
      imageName = await this.fileService.uploadFile(file);
    }

    // Construct updated image URL
    const imageUrl = process.env.IMAGE_URL + imageName;

    // Update cart item, including any changes to the cart item values
    await this.prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        productId: cartItemUpdateInput.productId,
        imageName: imageName,
        imageUrl: imageUrl,
        cartItemValues: {
          deleteMany: {}, // Delete all existing cart item values before updating
          create:
            cartItemUpdateInput.cartItemValues?.map((itemValue) => ({
              specificationId: itemValue.specificationId,
              value: itemValue.value,
            })) || [],
        },
      },
      include: {
        cartItemValues: true, // To return updated cart item values
      },
    });

    return { message: 'Cart item updated successfully' };
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
