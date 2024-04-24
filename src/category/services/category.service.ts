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
    const catagory = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!catagory) {
      throw new ApiError(404, 'not_found', 'not_found');
    }

    await this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return await this.getParentCategoryWithChildren(
      catagory.parentMostCategoryId,
      catagory.depth,
    );
  }
}
