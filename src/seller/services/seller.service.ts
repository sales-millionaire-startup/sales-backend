import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SellerCategoryInput, SellerInfoInput } from '../models/seller.model';

@Injectable()
export class SellerService {
    constructor(private prisma: PrismaService) {}

    async updateSellerInfo(
        sellerInfoInput: SellerInfoInput,
        sellerId: number,
    ): Promise<any> {
        const seller = await this.prisma.seller.findUnique({
            where: {
                id: sellerId,
            },
        });

        if (!seller) {
            throw new Error('Seller not found');
        }

        return await this.prisma.seller.update({
            where: {
                id: sellerId,
            },
            data: {
                companyName: sellerInfoInput.companyName,
                address: sellerInfoInput.address,
                city: sellerInfoInput.city,
            },
        });
    }

    async getSellerInfo(sellerId: number): Promise<any> {
        return await this.prisma.seller.findUnique({
            where: {
                id: sellerId,
            },
        });
    }

    async setSellingCategories(
        sellerCategoryInput: SellerCategoryInput,
    ): Promise<any> {
        return this.prisma.$transaction(async (tx) => {
            await tx.seller.update({
                where: { id: sellerCategoryInput.sellerId },
                data: { categories: { set: [] } },
            });

            return tx.seller.update({
                where: { id: sellerCategoryInput.sellerId },
                data: {
                    categories: {
                        connect: sellerCategoryInput.categoryIds.map((id) => ({
                            id,
                        })),
                    },
                },
            });
        });
    }
}
