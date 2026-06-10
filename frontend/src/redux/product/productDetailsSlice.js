import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getProductById = createAsyncThunk(
    'productDetails/getProductById',
    async (id, thunkAPI) => {
        try {

            const response = await api.get(
                `/products/${id}`
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                'Failed to load product'
            );
        }
    }
);

const productDetailsSlice = createSlice({
    name: 'productDetails',

    initialState: {
        product: null,
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(getProductById.pending, (state) => {

                state.loading = true;
            })

            .addCase(getProductById.fulfilled, (state, action) => {

                state.loading = false;
                state.product = action.payload;
            })

            .addCase(getProductById.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productDetailsSlice.reducer;