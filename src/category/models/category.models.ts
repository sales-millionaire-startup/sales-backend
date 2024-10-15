/* eslint-disable indent */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryCreateInput {
    @IsOptional()
    @IsString()
    name_en?: string | null;

    @IsOptional()
    @IsString()
    name_ge?: string | null;

    @IsOptional()
    @IsString()
    name_tr?: string | null;

    @IsNumber()
    depth?: number | null;

    @IsNumber()
    parentCategoryId?: number | null;

    @IsNumber()
    parentMostCategoryId?: number | null;
}

export class CategoryUpdateInput {
    @IsOptional()
    @IsString()
    name_en?: string | null;

    @IsOptional()
    @IsString()
    name_ge?: string | null;

    @IsOptional()
    @IsString()
    name_tr?: string | null;
}
