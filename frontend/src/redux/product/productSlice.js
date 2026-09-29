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

// Deliberately separate from `getProducts`/`state.products`: Home and
// Catalog rendering off the same array meant navigating Home -> Catalog
// could commit a frame where Catalog briefly re-rendered Home's stale list
// before its own reset-and-refetch effect ran — landing right inside the
// View Transition's snapshot window and tripping a duplicate
// view-transition-name (both pages reuse the same product ids/images).
export const getHomeProducts = createAsyncThunk(
    'products/getHomeProducts',
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

export const getRelatedProducts = createAsyncThunk(
    'products/getRelatedProducts',
    async ({ categoryId, excludeId }, thunkAPI) => {
        try {

            const response = await api.get(
                '/products',
                {
                    params: {
                        category: categoryId,
                        limit: 8,
                    },
                }
            );

            return response.data.data.products
                .filter((product) => String(product.id) !== String(excludeId))
                .slice(0, 6);

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                'Failed to load related products'
            );
        }
    }
);

export const getPriceRange = createAsyncThunk(
    'products/getPriceRange',
    async (_, thunkAPI) => {
        try {

            const response = await api.get(
                '/products/price-range'
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                'Failed to load price range'
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
        related: [],
        relatedLoading: false,
        priceRange: null,
        homeProducts: [],
        homeLoading: false,
        homePagination: null,
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
            )

            .addCase(getHomeProducts.pending, (state) => {

                state.homeLoading = true;
            })

            .addCase(getHomeProducts.fulfilled, (state, action) => {

                state.homeLoading = false;
                state.homeProducts = action.payload.products;
                state.homePagination = action.payload.pagination;
            })

            .addCase(getHomeProducts.rejected, (state, action) => {

                state.homeLoading = false;
                state.error = action.payload;
            })

            .addCase(getRelatedProducts.pending, (state) => {

                state.relatedLoading = true;
            })

            .addCase(getRelatedProducts.fulfilled, (state, action) => {

                state.relatedLoading = false;
                state.related = action.payload;
            })

            .addCase(getRelatedProducts.rejected, (state, action) => {

                state.relatedLoading = false;
                state.error = action.payload;
            })

            .addCase(getPriceRange.fulfilled, (state, action) => {

                state.priceRange = action.payload;
            });
    },
});

export const {
    resetProducts,
} = productSlice.actions;

export default productSlice.reducer;