const cartItemValueIncludes = {
  specification: {
    include: {
      unitElement: true,
    },
  },
};

const cartItemIncludes = {
  product: true,
  cartItemValues: {
    include: cartItemValueIncludes,
  },
};

const cartIncludes = {
  cartItems: {
    include: cartItemIncludes,
  },
};

export { cartItemValueIncludes, cartItemIncludes, cartIncludes };
