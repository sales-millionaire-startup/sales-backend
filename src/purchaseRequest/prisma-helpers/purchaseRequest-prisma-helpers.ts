const purchaseRequestItemValueIncludes = {
  include: {
    specification: {
      include: {
        unitElement: true,
      },
    },
  },
};

const purchaseRequestItemIncludes = {
  purchaseRequestItems: {
    include: {
      product: true,
      purchaseRequestItemValues: purchaseRequestItemValueIncludes,
    },
  },
};

export { purchaseRequestItemValueIncludes, purchaseRequestItemIncludes };
