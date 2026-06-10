import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, thunkAPI) => {
        try {

            const response = await api.get('/cart');

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (productId, thunkAPI) => {
        try {

            await api.post(
                '/cart/add',
                {
                    productId,
                }
            );

            thunkAPI.dispatch(
                getCart()
            );

            return productId;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, thunkAPI) => {
        try {

            await api.delete(
                `/cart/remove?productId=${productId}`
            );

            thunkAPI.dispatch(
                getCart()
            );

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',

    initialState: {
        items: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(getCart.pending, (state) => {

                state.loading = true;
            })

            .addCase(getCart.fulfilled, (state, action) => {

                console.log('CART PAYLOAD:', action.payload);

                state.loading = false;
                state.items = action.payload;
            })

            .addCase(getCart.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;
            });


    },
});

export default cartSlice.reducer;