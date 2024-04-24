import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ProductCreateInput,
  ProductUpdateInput,
} from '../models/product.models';
import { includeChildrenRecursive } from '../../category/prisma-helpers/category-prisma-helpers';

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
          unitElementId: spec.unitId,
          values_en: spec.values_en,
          values_ge: spec.values_ge,
          values_tr: spec.values_tr,
        }),
      );

      await tx.specification.createMany({
        data: specificationData,
      });

      return await this.getProductsTree(newProduct);
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
              unitElementId: spec.unitId,
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
              unitElementId: spec.unitId,
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

      return await this.getProductsTree(updatedProduct);
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
    await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }

  private async getProductsTree(product) {
    return await this.prisma.category.findUnique({
      where: { id: product.category.parentCategoryId },
      include: includeChildrenRecursive(
        product.category.parentMostCategory.maxDepth || 0,
      ),
    });
  }
}
