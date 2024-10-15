/* eslint-disable indent */
import {
    IsString,
    IsNumber,
    IsArray,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class ProductCreateInput {
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
    categoryId: number;

    @IsOptional()
    @IsArray()
    specifications?: Array<SpecificationInput>;
}

export class ProductUpdateInput {
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
    categoryId: number;

    @IsOptional()
    @IsString()
    imageName?: string | null;

    @IsOptional()
    @IsArray()
    specifications?: Array<SpecificationInput>;
}

export class SpecificationInput {
    @IsOptional()
    @IsNumber()
    id?: number | null;

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
    productId: number;

    @IsOptional()
    @IsNumber()
    unitElementId?: number | null;

    @IsOptional()
    @IsBoolean()
    isSplitable?: boolean | null;
}
