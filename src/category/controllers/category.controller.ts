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
import { ErrorService } from 'src/core/error/error.service';
import {
    CategoryCreateInput,
    CategoryUpdateInput,
} from '../models/category.models';
import { Role } from '@prisma/client';
import { Roles } from 'src/core/common/roles.decorator';
import { RolesGuard } from 'src/core/common/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private errorService: ErrorService,
    ) {}

    @Get('')
    @Roles(Role.BUYER, Role.ADMIN)
    async getAllParents(): Promise<any> {
        try {
            return await this.categoryService.getAllParentCategory();
        } catch (error) {
            return await this.errorService.handleError(error);
        }
    }

    @Get('flattend')
    @Roles(Role.ADMIN)
    async getFlattened(): Promise<any> {
        try {
            return await this.categoryService.getAllFlattened();
        } catch (error) {
            return await this.errorService.handleError(error);
        }
    }

    @Get(':categoryId')
    @Roles(Role.BUYER, Role.ADMIN)
    async getCategory(
        @Param('categoryId', new ParseIntPipe()) categoryId: number,
        @Query('depth') depth: number,
    ): Promise<any> {
        try {
            return await this.categoryService.getParentCategoryWithChildren(
                categoryId,
                +depth,
            );
        } catch (error) {
            return await this.errorService.handleError(error);
        }
    }

    @Post('')
    @Roles(Role.ADMIN)
    async createCategory(
        @Body() categoryCreateInput: CategoryCreateInput,
    ): Promise<any> {
        try {
            return await this.categoryService.createSingleCategory(
                categoryCreateInput,
            );
        } catch (error) {
            return await this.errorService.handleError(error);
        }
    }

    @Put(':categoryId')
    @Roles(Role.ADMIN)
    async updateCategory(
        @Param('categoryId', new ParseIntPipe()) categoryId,
        @Body() categoryUpdateInput: CategoryUpdateInput,
    ): Promise<any> {
        try {
            return await this.categoryService.updateSingleCategory(
                categoryUpdateInput,
                categoryId,
            );
        } catch (error) {
            return await this.errorService.handleError(error);
        }
    }

    @Delete(':categoryId')
    @Roles(Role.ADMIN)
    async deleteModule(
        @Param('categoryId', new ParseIntPipe()) categoryId,
    ): Promise<any> {
        try {
            return await this.categoryService.deleteCategory(categoryId);
        } catch (error) {
            return await this.errorService.handleError(error);
        }
    }
}
