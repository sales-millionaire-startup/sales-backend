const includeChildrenRecursive = (depth: number): Record<string, any> => {
  if (depth === 0) {
    return {};
  }
  if (depth === 1) {
    return { childCategories: true };
  }
  return { childCategories: { include: includeChildrenRecursive(depth - 1) } };
};
export { includeChildrenRecursive };
