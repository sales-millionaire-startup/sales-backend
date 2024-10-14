/* eslint-disable indent */
import { IsNumber, IsString } from 'class-validator';

export class CategoryCreateInput {
    @IsString()
    name_en?: string;

    @IsString()
    name_ge?: string;

    @IsString()
    name_tr?: string;

    @IsNumber()
    depth?: number;

    @IsNumber()
    parentCategoryId?: number;

    @IsNumber()
    parentMostCategoryId?: number;
}

export class CategoryUpdateInput {
    @IsString()
    name_en?: string;

    @IsString()
    name_ge?: string;

    @IsString()
    name_tr?: string;
}
