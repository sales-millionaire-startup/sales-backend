/* eslint-disable indent */
import { IsArray, IsNumber, IsString } from 'class-validator';

export class SellerInfoInput {
    @IsString()
    companyName?: string;

    @IsString()
    address?: string;

    @IsString()
    city?: string;
}

export class SellerCategoryInput {
    @IsNumber()
    sellerId: number;

    @IsArray()
    categoryIds: number[];
}
