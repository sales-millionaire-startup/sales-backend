export interface CartItemCreateInput {
  cartId: number;
  productId: number;
  cartItemValues?: Array<CartItemValue>;
}

export interface CartItemUpdateInput {
  cartId: number;
  productId: number;
  imageName?: string;
  cartItemValues?: Array<CartItemValue>;
}

export interface CartItemValue {
  specificationId: number;
  value: string;
}
