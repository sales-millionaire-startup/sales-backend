import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ProductCreateInput,
  ProductUpdateInput,
} from '../models/product.models';
import { includeChildrenRecursive } from '../../category/prisma-helpers/category-prisma-helpers';
import { ApiError } from '../../core/api-errors/api-error';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createSingleProduct(productCreateInput: ProductCreateInput) {
    return await this.prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
        data: {
          name_en: productCreateInput.name_en,
          name_ge: productCreateInput.name_ge,
          name_tr: productCreateInput.name_tr,
          categoryId: productCreateInput.categoryId,
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
          values_en: spec.values_en,
          values_ge: spec.values_ge,
          values_tr: spec.values_tr,
        }),
      );

      await tx.specification.createMany({
        data: specificationData,
      });

      return await this.getProductsTree(tx, newProduct);
    });
  }

  async updateSingleProduct(productUpdateInput: ProductUpdateInput, productId) {
    return await this.prisma.$transaction(async (tx) => {
      // Update the product with the given productId
      const updatedProduct = await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          name_en: productUpdateInput.name_en,
          name_ge: productUpdateInput.name_ge,
          name_tr: productUpdateInput.name_tr,
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

      // Update or create specifications based on the input and include the unit details
      const updatedSpecifications = [];

      for (const spec of productUpdateInput.specifications) {
        if (spec.id) {
          // Update existing specification
          const updatedSpec = await tx.specification.update({
            where: {
              id: spec.id,
            },
            data: {
              name_en: spec.name_en,
              name_ge: spec.name_ge,
              name_tr: spec.name_tr,
              unitElementId: spec.unitElementId,
              values_en: spec.values_en,
              values_ge: spec.values_ge,
              values_tr: spec.values_tr,
            },
            include: {
              unitElement: true, // Include the unit in the updated specification
            },
          });
          updatedSpecifications.push(updatedSpec);
        } else {
          // Create a new specification
          const newSpec = await tx.specification.create({
            data: {
              name_en: spec.name_en,
              name_ge: spec.name_ge,
              name_tr: spec.name_tr,
              productId: productId,
              unitElementId: spec.unitElementId,
              values_en: spec.values_en,
              values_ge: spec.values_ge,
              values_tr: spec.values_tr,
            },
            include: {
              unitElement: true, // Include the unit in the new specification
            },
          });
          updatedSpecifications.push(newSpec);
        }
      }

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
      return await this.getProductsTree(tx, product);
    });
  }

  private async getProductsTree(tx, product) {
    let maxDepth = 0;
    if (product?.category?.parentMostCategory) {
      maxDepth = product.category.parentMostCategory?.maxDepth;
    } else {
      maxDepth = product?.category?.maxDepth || 0;
    }

    return await tx.category.findUnique({
      where: {
        id: product.category?.parentMostCategoryId || product.categoryId,
      },
      include: includeChildrenRecursive(maxDepth),
    });
  }
}
