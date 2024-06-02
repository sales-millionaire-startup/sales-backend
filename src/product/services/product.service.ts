import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ProductCreateInput,
  ProductUpdateInput,
} from '../models/product.models';
import { includeChildrenRecursive } from '../../category/prisma-helpers/category-prisma-helpers';
import { ApiError } from '../../core/api-errors/api-error';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

@Injectable()
export class ProductService {
  private readonly s3Client: S3Client;

  constructor(private prisma: PrismaService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_S3_REGION,
    });
  }

  async createSingleProduct(productCreateInput: ProductCreateInput, file) {
    const imageName = await this.uploadFile(file);
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
    productId,
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
      imageName = await this.uploadFile(file);
    }

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
        id: product.category?.parentMostCategoryId || product.categoryId,
      },
      include: includeChildrenRecursive(maxDepth),
    });
  }

  private async uploadFile(file) {
    if (!file) {
      return '';
    }

    if (!file?.originalname) {
      throw new Error('File name is required.');
    }

    const randomImageName = (bytes = 32) =>
      crypto.randomBytes(bytes).toString('hex');

    const res = randomImageName();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKE_NAME,
        Key: res,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
      }),
    );

    return res;
  }

  private async deleteImage(product: any) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKE_NAME,
        Key: product.imageName,
      }),
    );
  }
}
