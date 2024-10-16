/* eslint-disable indent */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
    ProductCreateInput,
    ProductUpdateInput,
} from '../models/product.models';
import { includeChildrenRecursive } from '../../category/prisma-helpers/category-prisma-helpers';
import { FileService } from 'src/core/files/fileService';
import { ApiError } from 'src/core/api-errors/api-error';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private fileService: FileService,
    ) {}

    async createSingleProduct(productCreateInput: ProductCreateInput, file) {
        const imageName = await this.fileService.uploadFile(file);
        return await this.prisma.$transaction(async (tx) => {
            // Create the product
            const newProduct = await tx.product.create({
                data: {
                    name_en: productCreateInput.name_en,
                    name_ge: productCreateInput.name_ge,
                    name_tr: productCreateInput.name_tr,
                    categoryId: productCreateInput.categoryId,
                    imageName: imageName,
                    imageUrl: process.env.IMAGE_URL + imageName,
                },
                include: {
                    category: {
                        include: {
                            parentMostCategory: true,
                        },
                    },
                },
            });

            // Create the specifications associated with the new product
            const specificationData = productCreateInput.specifications.map(
                (spec) => ({
                    name_en: spec.name_en,
                    name_ge: spec.name_ge,
                    name_tr: spec.name_tr,
                    productId: newProduct.id,
                    unitElementId: spec.unitElementId,
                    isSplitable: spec.isSplitable,
                    hierarchyInd:
                        productCreateInput.specifications.indexOf(spec),
                }),
            );

            await tx.specification.createMany({
                data: specificationData,
            });

            return await this.getProductsTree(tx, newProduct);
        });
    }

    async updateSingleProduct(
        productUpdateInput: ProductUpdateInput,
        productId: number,
        file,
    ) {
        const product = await this.prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            throw new ApiError(404, 'not_found', 'not_found');
        }

        let imageName = productUpdateInput.imageName;

        if (productUpdateInput.imageName !== product.imageName) {
            imageName = await this.fileService.uploadFile(file);
        }

        return await this.prisma.$transaction(async (tx) => {
            const updatedProduct = await tx.product.update({
                where: {
                    id: productId,
                },
                data: {
                    name_en: productUpdateInput.name_en,
                    name_ge: productUpdateInput.name_ge,
                    name_tr: productUpdateInput.name_tr,
                    imageName: imageName,
                    imageUrl: process.env.IMAGE_URL + imageName,
                    categoryId: productUpdateInput.categoryId,
                },
                include: {
                    category: {
                        include: {
                            parentMostCategory: true,
                        },
                    },
                },
            });

            // Upsert or create specifications
            const specificationPromises = productUpdateInput.specifications.map(
                (spec, index) =>
                    spec.id
                        ? tx.specification.update({
                              where: { id: spec.id },
                              data: {
                                  name_en: spec.name_en,
                                  name_ge: spec.name_ge,
                                  name_tr: spec.name_tr,
                                  unitElementId: spec.unitElementId,
                                  isSplitable: spec.isSplitable,
                                  hierarchyInd: index,
                              },
                          })
                        : tx.specification.create({
                              data: {
                                  name_en: spec.name_en,
                                  name_ge: spec.name_ge,
                                  name_tr: spec.name_tr,
                                  productId: updatedProduct.id,
                                  unitElementId: spec.unitElementId,
                                  isSplitable: spec.isSplitable,
                                  hierarchyInd: index,
                              },
                          }),
            );

            await Promise.all(specificationPromises);

            // Remove specifications not included in the update
            await tx.specification.deleteMany({
                where: {
                    productId: productId,
                    id: {
                        notIn: productUpdateInput.specifications
                            .map((spec) => spec.id)
                            .filter(Boolean),
                    },
                },
            });

            return await this.getProductsTree(tx, updatedProduct);
        });
    }

    async getCategoryProducts(categoryId: number) {
        return await this.prisma.product.findMany({
            where: {
                categoryId: categoryId,
            },
            include: {
                specifications: {
                    include: {
                        unitElement: true,
                    },
                    orderBy: {
                        hierarchyInd: 'asc',
                    },
                },
            },
        });
    }

    async deleteProduct(productId) {
        return await this.prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: {
                    id: productId,
                },
                include: {
                    category: {
                        include: {
                            parentMostCategory: true,
                        },
                    },
                },
            });

            if (!product) {
                throw new ApiError(
                    404,
                    'product_does_not_exists',
                    'product_does_not_exists',
                );
            }
            await tx.product.delete({
                where: {
                    id: productId,
                },
            });

            //await this.deleteImage(product);
            return await this.getProductsTree(tx, product);
        });
    }

    private async getProductsTree(tx, product) {
        let maxDepth: number;
        if (product?.category?.parentMostCategory) {
            maxDepth = product.category.parentMostCategory?.maxDepth;
        } else {
            maxDepth = product?.category?.maxDepth || 0;
        }

        return await tx.category.findUnique({
            where: {
                id:
                    product.category?.parentMostCategoryId ||
                    product.categoryId,
            },
            include: includeChildrenRecursive(maxDepth),
        });
    }
}
