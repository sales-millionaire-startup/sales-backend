/* eslint-disable indent */
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CartItemCreateInput {
    @IsNumber()
    cartId: number;

    @IsNumber()
    productId: number;

    @IsOptional()
    @IsArray()
    cartItemValues?: Array<CartItemValue>;
}

export class CartItemUpdateInput {
    @IsNumber()
    cartId: number;

    @IsNumber()
    productId: number;

    @IsOptional()
    @IsString()
    imageName?: string;

    @IsOptional()
    @IsArray()
    cartItemValues?: Array<CartItemValue>;
}

export class CartItemValue {
    @IsNumber()
    specificationId: number;

    @IsString()
    value: string;
}
