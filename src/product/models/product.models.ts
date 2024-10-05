export interface ProductCreateInput {
  name_en?: string;
  name_ge?: string;
  name_tr?: string;
  categoryId: number;
  specifications?: Array<SpecificationInput>;
}

export interface ProductUpdateInput {
  name_en?: string;
  name_ge?: string;
  name_tr?: string;
  categoryId: number;
  imageName?: string;
  specifications?: Array<SpecificationInput>;
}

export interface SpecificationInput {
  id?: number;
  name_en?: string;
  name_ge?: string;
  name_tr?: string;
  productId: number;
  unitElementId: number;
  isSplitable?: boolean;
}
