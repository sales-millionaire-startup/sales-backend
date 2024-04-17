import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import {
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../models/category.models';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  async getAllWithChildren(): Promise<any> {
    return await this.categoryService.getAllCategoryWithChildren();
  }

  @Get('parents')
  async getAllParents(): Promise<any> {
    return await this.categoryService.getAllParentCategory();
  }

  @Get(':categoryId')
  async getCategory(
    @Param('categoryId', new ParseIntPipe()) categoryId,
  ): Promise<any> {
    return await this.categoryService.getParentCategoryWithChildren(categoryId);
  }

  @Post('')
  async createCategory(@Body() createModuleInput: CategoryCreateInput): Promise<any> {
    return await this.categoryService.createSingleCategory(createModuleInput);
  }

  @Put(':categoryId')
  async updateModule(
    @Param('categoryId', new ParseIntPipe()) categoryId,
    @Body() categoryUpdateInput: CategoryUpdateInput,
  ): Promise<any> {
    return await this.categoryService.updateSingleCategory(
      categoryUpdateInput,
      categoryId,
    );
  }

  @Delete(':categoryId')
  async deleteModule(
    @Param('categoryId', new ParseIntPipe()) categoryId,
  ): Promise<any> {
    return await this.categoryService.deleteCategory(categoryId);
  }
}
