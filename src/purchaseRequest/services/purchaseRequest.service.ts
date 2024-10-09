import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { purchaseRequestItemIncludes } from '../prisma-helpers/purchaseRequest-prisma-helpers';
import { cartIncludes } from 'src/cart/prisma-helpers/cart-prisma-helpers';
import { PurchaseRequestUpdateInput } from '../models/purchaseRequest.models';
import { Role } from '@prisma/client';

@Injectable()
export class PurchaseRequestService {
  constructor(private prisma: PrismaService) {}

  async getPurchaseRequests(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        buyer: true,
      },
    });

    if (!user || user.role === Role.SELLER) {
      throw new BadRequestException('User is not a buyer');
    }

    return await this.prisma.purchaseRequest.findMany({
      where: {
        buyerId: user.buyer.id,
      },
      include: purchaseRequestItemIncludes,
    });
  }

  async createPurchaseRequest(userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        buyer: true,
      },
    });

    if (!user || user.role === Role.SELLER) {
      throw new BadRequestException('User is not a buyer');
    }

    const cart = await this.prisma.cart.findUnique({
      where: {
        buyerId: user.buyer.id,
      },
      include: cartIncludes,
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty or does not exist');
    }

    const purchaseRequest = await this.mapCartToPurchaseRequest(cart);
    await this.clearCart(cart.id);
    return purchaseRequest;
  }

  async mapCartToPurchaseRequest(cart) {
    const purchaseRequest = await this.prisma.purchaseRequest.create({
      data: {
        buyerId: cart.buyerId,
        purchaseRequestItems: {
          create: cart.cartItems.map((cartItem) => ({
            productId: cartItem.productId,
            imageName: cartItem.imageName,
            imageUrl: cartItem.imageUrl,
            purchaseRequestItemValues: {
              create: cartItem.cartItemValues.map((itemValue) => ({
                specificationId: itemValue.specificationId,
                stringValue:
                  itemValue.specification.isSplitable &&
                  !isNaN(Number(itemValue.value))
                    ? null
                    : itemValue.value,
                numericValue:
                  itemValue.specification.isSplitable &&
                  !isNaN(Number(itemValue.value))
                    ? +itemValue.value
                    : null,

                buyerComment: itemValue.buyerComment,
              })),
            },
          })),
        },
      },
      include: purchaseRequestItemIncludes,
    });

    return purchaseRequest;
  }

  async clearCart(cartId: number) {
    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cartId,
      },
    });
  }

  async updatePurchaseRequest(
    id: number,
    purchaseRequestUpdateInput: PurchaseRequestUpdateInput,
  ): Promise<any> {
    return await this.prisma.purchaseRequest.update({
      where: {
        id: id,
      },
      data: {
        status: purchaseRequestUpdateInput.purchaseRequestStatus,
      },
    });
  }
}
