// Recursive function to include child categories and products at each level
const includeChildrenRecursive = (
  depth: number,
  productsInclude = includeProductsNested,
): Record<string, any> => {
  if (depth === 0) {
    // Base case: return empty object when depth is 0
    return {};
  }

  // Include products at the current level
  const includeAtLevel = {
    ...productsInclude, // Include products and related structures
    childCategories: {
      include: {}, // Placeholder for recursive inclusion
    },
  };

  if (depth > 1) {
    // Recursively include child categories and products for deeper levels
    includeAtLevel.childCategories.include = includeChildrenRecursive(
      depth - 1,
      productsInclude,
    );
  }

  return includeAtLevel;
};

const includeProductsNested = {
  products: {
    include: {
      specifications: {
        include: {
          unitElement: true,
        },
      },
    },
  },
};

export { includeChildrenRecursive };
