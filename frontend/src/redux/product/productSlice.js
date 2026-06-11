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

            thunkAPI.dispatch(
                getProducts()
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

            thunkAPI.dispatch(
                getProducts()
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

            thunkAPI.dispatch(
                getProducts()
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