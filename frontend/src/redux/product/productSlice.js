import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async (params = {}, thunkAPI) => {
        try {

            const response = await api.get(
                '/products',
                {
                    params,
                }
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                'Failed to load products'
            );
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (formData, thunkAPI) => {
        try {

            const response = await api.post(
                '/products',
                formData,
                {
                    headers: {
                        'Content-Type':
                            'multipart/form-data',
                    },
                }
            );

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async (formData, thunkAPI) => {
        try {

            const id = formData.get('id');

            const response = await api.post(
                `/products/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type':
                            'multipart/form-data',
                    },
                }
            );

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, thunkAPI) => {
        try {

            await api.delete(
                `/products/${id}`
            );

            return id;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

const productSlice = createSlice({
    name: 'products',

    initialState: {
        products: [],
        pagination: null,
        loading: false,
        loadingMore: false,
        hasMore: true,
        error: null,
    },

    reducers: {

        resetProducts: (state) => {

            state.products = [];
            state.pagination = null;
            state.hasMore = true;
        },
    },

    extraReducers: (builder) => {

        builder

            .addCase(getProducts.pending, (state, action) => {

                const page =
                    action.meta.arg?.page || 1;

                if (page === 1) {

                    state.loading = true;

                } else {

                    state.loadingMore = true;
                }
            })

            .addCase(
                getProducts.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.loadingMore = false;

                    const {
                        products,
                        pagination,
                    } = action.payload;

                    if (
                        pagination.page === 1
                    ) {

                        state.products = products;

                    } else {

                        state.products = [
                            ...state.products,
                            ...products,
                        ];
                    }

                    state.pagination =
                        pagination;

                    state.hasMore =
                        pagination.page <
                        pagination.pages;
                }
            )

            .addCase(
                getProducts.rejected,
                (state, action) => {

                    state.loading = false;
                    state.loadingMore = false;
                    state.error =
                        action.payload;
                }
            );
    },
});

export const {
    resetProducts,
} = productSlice.actions;

export default productSlice.reducer;