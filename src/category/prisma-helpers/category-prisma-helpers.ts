const includeChildrenRecursive = (): Record<string, any> => {
  return {
    include: {
      children: { include: { children: includeChildrenRecursive() } },
    },
  };
};
