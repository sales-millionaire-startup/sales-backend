export interface CategoryCreateInput {
  name_en?: string;
  name_ge?: string;
  name_tr?: string;
  depth?: number;
  parentCategoryId?: number;
  parentMostCategoryId?: number;
}

export interface CategoryUpdateInput {
  name_en?: string;
  name_ge?: string;
  name_tr?: string;
}
