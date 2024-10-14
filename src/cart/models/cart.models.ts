/* eslint-disable indent */
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CartItemCreateInput {
    @IsNumber()
    cartId: number;

    @IsNumber()
    productId: number;

    @IsArray()
    cartItemValues?: Array<CartItemValue>;
}

export class CartItemUpdateInput {
    @IsNumber()
    cartId: number;

    @IsNumber()
    productId: number;

    @IsString()
    imageName?: string;

    @IsArray()
    cartItemValues?: Array<CartItemValue>;
}

export class CartItemValue {
    @IsNumber()
    specificationId: number;

    @IsString()
    value: string;
}
