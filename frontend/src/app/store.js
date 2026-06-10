import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../redux/auth/authSlice';
import productReducer from '../redux/product/productSlice';
import productDetailsReducer from '../redux/product/productDetailsSlice';
import cartReducer from '../redux/cart/cartSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        productDetails: productDetailsReducer,
        cart: cartReducer,
    },
});