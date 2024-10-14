/* eslint-disable indent */
import { IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class ProductCreateInput {
    @IsString()
    name_en?: string;

    @IsString()
    name_ge?: string;

    @IsString()
    name_tr?: string;

    @IsNumber()
    categoryId: number;

    @IsArray()
    specifications?: Array<SpecificationInput>;
}

export class ProductUpdateInput {
    @IsString()
    name_en?: string;

    @IsString()
    name_ge?: string;

    @IsString()
    name_tr?: string;

    @IsNumber()
    categoryId: number;

    @IsString()
    imageName?: string;

    @IsArray()
    specifications?: Array<SpecificationInput>;
}

export class SpecificationInput {
    @IsNumber()
    id?: number;

    @IsString()
    name_en?: string;

    @IsString()
    name_ge?: string;

    @IsString()
    name_tr?: string;

    @IsNumber()
    productId: number;

    @IsNumber()
    unitElementId: number;

    @IsBoolean()
    isSplitable?: boolean;
}
