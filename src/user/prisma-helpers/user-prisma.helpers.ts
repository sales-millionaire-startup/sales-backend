import { cartIncludes } from 'src/cart/prisma-helpers/cart-prisma-helpers';

const userBuyerIncludes = {
    buyer: {
        include: {
            cart: {
                include: cartIncludes,
            },
        },
    },
};

const userSellerIncludes = {
    seller: true,
};

export { userBuyerIncludes, userSellerIncludes };
