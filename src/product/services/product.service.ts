import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ProductCreateInput,
  ProductUpdateInput,
} from '../models/product.models';

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
      });

      // Create the specifications associated with the new product
      const specificationData = productCreateInput.specifications.map(
        (spec) => ({
          name_en: spec.name_en,
          name_ge: spec.name_ge,
          name_tr: spec.name_tr,
          productId: newProduct.id,
          unitId: spec.unitId,
          values: spec.values,
        }),
      );

      await tx.specification.createMany({
        data: specificationData,
      });

      // Fetch the complete product object with its related specifications
      const productWithRelations = await tx.product.findUnique({
        where: {
          id: newProduct.id,
        },
        include: {
          specifications: {
            include: {
              unit: true,
            },
          },
        },
      });

      return productWithRelations;
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
              unitId: spec.unitId,
              values: spec.values,
            },
            include: {
              unit: true, // Include the unit in the updated specification
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
              unitId: spec.unitId,
              values: spec.values,
            },
            include: {
              unit: true, // Include the unit in the new specification
            },
          });
          updatedSpecifications.push(newSpec);
        }
      }

      // Return the updated product with its specifications and related units
      return {
        ...updatedProduct,
        specifications: updatedSpecifications,
      };
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
            unit: true,
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
}
