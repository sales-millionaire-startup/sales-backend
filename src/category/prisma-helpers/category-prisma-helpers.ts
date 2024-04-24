const includeChildrenRecursive = (
  depth: number,
  productsInclude = includeProductsNested,
): Record<string, any> => {
  if (depth === 0) {
    return {};
  }
  if (depth === 1) {
    return { childCategories: productsInclude };
  }
  return {
    childCategories: {
      include: includeChildrenRecursive(depth - 1, productsInclude),
    },
  };
};

const includeProductsNested = {
  include: {
    products: {
      include: {
        specifications: {
          include: {
            unitElement: true,
          },
        },
      },
    },
  },
};

export { includeChildrenRecursive };
