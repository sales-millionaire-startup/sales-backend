export interface SellerInfoInput {
  companyName?: string;
  address?: string;
  city?: string;
}

export interface SellerCategoryInput {
  sellerId: number;
  categoryIds: number[];
}
