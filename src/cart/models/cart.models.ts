export interface CartItemCreateInput {
  productId: number;
  cartItemValues?: Array<CartItemValue>;
}

export interface CartItemValue {
  specificationId: number;
  value: string;
}
