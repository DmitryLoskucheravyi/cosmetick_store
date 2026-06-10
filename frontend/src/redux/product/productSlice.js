import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async (_, thunkAPI) => {
        try {

            const response = await api.get('/products');

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                'Failed to load products'
            );
        }
    }
);

const productSlice = createSlice({
    name: 'products',

    initialState: {
        products: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(getProducts.pending, (state) => {

                state.loading = true;
            })

            .addCase(getProducts.fulfilled, (state, action) => {

                state.loading = false;
                state.products = action.payload;
            })

            .addCase(getProducts.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;