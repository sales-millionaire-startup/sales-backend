import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import {
    CategoryCreateInput,
    CategoryUpdateInput,
} from '../models/category.models';
import { Role } from '@prisma/client';
import { Roles } from 'src/core/common/roles.decorator';
import { RolesGuard } from 'src/core/common/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get('')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.BUYER, Role.ADMIN)
    async getAllParents(): Promise<any> {
        return await this.categoryService.getAllParentCategory();
    }

    @Get('flattend')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getFlattened(): Promise<any> {
        return await this.categoryService.getAllFlattened();
    }

    @Get(':categoryId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.BUYER, Role.ADMIN)
    async getCategory(
        @Param('categoryId', new ParseIntPipe()) categoryId: number,
        @Query('depth') depth: number,
    ): Promise<any> {
        return await this.categoryService.getParentCategoryWithChildren(
            categoryId,
            +depth,
        );
    }

    @Post('')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async createCategory(
        @Body() categoryCreateInput: CategoryCreateInput,
    ): Promise<any> {
        return await this.categoryService.createSingleCategory(
            categoryCreateInput,
        );
    }

    @Put(':categoryId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async updateCategory(
        @Param('categoryId', new ParseIntPipe()) categoryId,
        @Body() categoryUpdateInput: CategoryUpdateInput,
    ): Promise<any> {
        return await this.categoryService.updateSingleCategory(
            categoryUpdateInput,
            categoryId,
        );
    }

    @Delete(':categoryId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async deleteModule(
        @Param('categoryId', new ParseIntPipe()) categoryId,
    ): Promise<any> {
        return await this.categoryService.deleteCategory(categoryId);
    }
}
