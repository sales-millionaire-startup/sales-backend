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
  values_en?: string[];
  values_ge?: string[];
  values_tr?: string[];
}
