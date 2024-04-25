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
    return await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: includeChildrenRecursive(depth || 0),
    });
  }

  async createSingleCategory(input: CategoryCreateInput) {
    //Creates newCategory
    const newCategory = await this.prisma.category.create({
      data: {
        name_en: input.name_en,
        name_ge: input.name_ge,
        name_tr: input.name_tr,
        depth: input.depth,
        parentCategoryId: input.parentCategoryId,
        parentMostCategoryId: input.parentMostCategoryId,
      },
      include: {
        parentCategory: true,
      },
    });

    let maxDepth = newCategory.parentCategory?.maxDepth || 0;
    const parentMostCategoryId = input.parentMostCategoryId || newCategory.id;

    //Updates parentMostCategory if depth increases
    if (newCategory.depth > maxDepth) {
      maxDepth = newCategory.depth;

      return await this.prisma.category.update({
        where: {
          id: newCategory.parentMostCategoryId,
        },
        data: {
          maxDepth: maxDepth,
        },
        include: includeChildrenRecursive(maxDepth || 0),
      });
    }

    return await this.getParentCategoryWithChildren(
      parentMostCategoryId,
      maxDepth,
    );
  }

  async updateSingleCategory(input: CategoryUpdateInput, categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new ApiError(404, 'not_found', 'not_found');
    }

    const updatedCategory = await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name_en: input.name_en,
        name_ge: input.name_ge,
        name_tr: input.name_tr,
      },
    });

    return await this.getParentCategoryWithChildren(
      category.parentMostCategoryId,
      updatedCategory.maxDepth,
    );
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

      return await this.getParentCategoryWithChildren(
        category.parentMostCategoryId,
        updatedMaxDepth,
      );
    });
  }

  private async updateParentMostCategory(categoryBeingDeleted, tx) {
    let newMaxDepth = categoryBeingDeleted.parentMostCategory.maxDepth;
    if (
      categoryBeingDeleted.depth ===
      categoryBeingDeleted.parentMostCategory.maxDepth
    ) {
      newMaxDepth =
        categoryBeingDeleted.depth - 1 >= 0
          ? categoryBeingDeleted.depth - 1
          : 0;

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
