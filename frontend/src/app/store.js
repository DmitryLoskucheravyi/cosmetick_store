import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../redux/auth/authSlice';
import productReducer from '../redux/product/productSlice';
import productDetailsReducer from '../redux/product/productDetailsSlice';
import cartReducer from '../redux/cart/cartSlice';
import orderReducer from '../redux/order/orderSlice';
import categoryReducer from '../redux/category/categorySlice';
import adminReducer from '../redux/admin/adminSlice';




export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        productDetails: productDetailsReducer,
        cart: cartReducer,
        orders: orderReducer,
        categories: categoryReducer,
        admin: adminReducer,
    },
});