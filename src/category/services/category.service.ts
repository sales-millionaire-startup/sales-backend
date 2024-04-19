import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientService } from '../../prisma/prisma-client.service';
import {
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../models/category.models';
import { includeChildrenRecursive } from '../prisma-helpers/category-prisma-helpers';
import { ApiError } from '../../core/api-errors/api-error';

@Injectable()
export class CategoryService {
  private readonly prisma: PrismaService;

  constructor(private prismaClient: PrismaService) {
    this.prisma = prismaClient;
    //this.prisma = prismaClient.getClient();
  }

  async getAllParentCategory() {
    return await this.prisma.category.findMany();
  }

  async getAllCategoryWithChildren() {
    return await this.prisma.category.findMany({
      include: includeChildrenRecursive(0),
    });
  }

  async getParentCategoryWithChildren(categoryId: number, depth: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: includeChildrenRecursive(depth || 0),
    });

    return category;
  }

  async createSingleCategory(input: CategoryCreateInput) {
    await this.prisma.category.create({
      data: {
        name_en: input.name_en,
        name_ge: input.name_ge,
        name_tr: input.name_tr,
        depth: input.depth,
        parentCategoryId: input.parentCategoryId,
        parentMostCategoryId: input.parentMostCategoryId,
      },
    });

    return await this.getParentCategoryWithChildren(
      input.parentMostCategoryId,
      input.depth,
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

    await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name_en: input.name_en,
        name_ge: input.name_ge,
        name_tr: input.name_tr,
        depth: input.depth,
      },
    });

    return await this.getParentCategoryWithChildren(
      category.parentMostCategoryId,
      input.depth,
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
