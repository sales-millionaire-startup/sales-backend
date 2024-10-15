/* eslint-disable indent */
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class SellerInfoInput {
    @IsOptional()
    @IsString()
    companyName?: string | null;

    @IsOptional()
    @IsString()
    address?: string | null;

    @IsOptional()
    @IsString()
    city?: string | null;
}

export class SellerCategoryInput {
    @IsNumber()
    sellerId: number;

    @IsArray()
    categoryIds: number[];
}
