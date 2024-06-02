import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../models/category.models';
import { includeChildrenRecursive } from '../prisma-helpers/category-prisma-helpers';
import { ApiError } from '../../core/api-errors/api-error';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllParentCategory() {
    return await this.prisma.category.findMany({
      where: {
        depth: 0,
      },
    });
  }

  async getParentCategoryWithChildren(categoryId: number, depth: number) {
    const includes = includeChildrenRecursive(depth || 0);
    //console.log(JSON.stringify(includes));
    return await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: includes,
    });
  }

  private async getParentCategoryWithChildrenForTransaction(
    categoryId: number,
    depth: number,
    tx,
  ) {
    return await tx.category.findUnique({
      where: { id: categoryId },
      include: includeChildrenRecursive(depth || 0),
    });
  }

  async createSingleCategory(input: CategoryCreateInput) {
    return await this.prisma.$transaction(async (tx) => {
      const newCategory = await tx.category.create({
        data: {
          name_en: input.name_en,
          name_ge: input.name_ge,
          name_tr: input.name_tr,
          depth: input.depth,
          parentCategoryId: input.parentCategoryId,
          parentMostCategoryId: input.parentMostCategoryId,
        },
        include: {
          parentMostCategory: true,
        },
      });

      let maxDepth = newCategory.parentMostCategory?.maxDepth || 0;
      const parentMostCategoryId = input.parentMostCategoryId || newCategory.id;

      //Updates parentMostCategory if depth increases
      if (newCategory.depth > maxDepth) {
        maxDepth = newCategory.depth;

        return await tx.category.update({
          where: {
            id: newCategory.parentMostCategoryId,
          },
          data: {
            maxDepth: maxDepth,
          },
          include: includeChildrenRecursive(maxDepth || 0),
        });
      }

      return await this.getParentCategoryWithChildrenForTransaction(
        parentMostCategoryId,
        maxDepth,
        tx,
      );
    });
  }

  async updateSingleCategory(input: CategoryUpdateInput, categoryId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new ApiError(404, 'not_found', 'not_found');
      }

      const updatedCategory = await tx.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name_en: input.name_en,
          name_ge: input.name_ge,
          name_tr: input.name_tr,
        },
      });

      return await this.getParentCategoryWithChildrenForTransaction(
        category.parentMostCategoryId || category.id,
        updatedCategory.maxDepth,
        tx,
      );
    });
  }

  async deleteCategory(categoryId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: {
          id: categoryId,
        },
        include: {
          parentMostCategory: true,
        },
      });

      if (!category) {
        throw new ApiError(
          404,
          'category_does_not_exists',
          'category_does_not_exists',
        );
      }

      const updatedMaxDepth = await this.updateParentMostCategory(category, tx);

      await tx.category.delete({
        where: {
          id: categoryId,
        },
      });

      return await this.getProductsTree(tx, category, updatedMaxDepth);
    });
  }

  private async getProductsTree(tx, category, updatedMaxDepth) {
    if (category.parentMostCategory) {
      return await tx.category.findUnique({
        where: { id: category.parentMostCategoryId },
        include: includeChildrenRecursive(updatedMaxDepth || 0),
      });
    }
    return [];
  }

  private async updateParentMostCategory(categoryBeingDeleted, tx) {
    let newMaxDepth = categoryBeingDeleted.parentMostCategory?.maxDepth;
    if (
      categoryBeingDeleted.depth ===
      categoryBeingDeleted.parentMostCategory?.maxDepth
    ) {
      const existingOnLastLevel = await this.prisma.category.findFirst({
        where: {
          depth: categoryBeingDeleted.depth,
          parentCategoryId: categoryBeingDeleted.parentMostCategoryId,
        },
      });

      if (!existingOnLastLevel) {
        newMaxDepth =
          categoryBeingDeleted.depth - 1 >= 0
            ? categoryBeingDeleted.depth - 1
            : 0;
      }

      await tx.category.update({
        where: {
          id: categoryBeingDeleted.parentMostCategoryId,
        },
        data: {
          maxDepth: newMaxDepth,
        },
      });
    }
    return newMaxDepth;
  }
}
