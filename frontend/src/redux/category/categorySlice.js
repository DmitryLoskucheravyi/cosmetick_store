import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async (_, thunkAPI) => {
        try {

            const response = await api.get(
                '/categories'
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);
export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (name, thunkAPI) => {
        try {

            const response = await api.post(
                '/categories/create',
                { name }
            );

            thunkAPI.dispatch(
                getCategories()
            );

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async (data, thunkAPI) => {
        try {

            const response = await api.put(
                '/categories/update',
                data
            );

            thunkAPI.dispatch(
                getCategories()
            );

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id, thunkAPI) => {
        try {

            await api.delete(
                `/categories/delete?id=${id}`
            );

            thunkAPI.dispatch(
                getCategories()
            );

            return id;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',

    initialState: {
        categories: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(
                getCategories.pending,
                (state) => {

                    state.loading = true;
                }
            )

            .addCase(
                getCategories.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.categories =
                        action.payload;
                }
            )

            .addCase(
                getCategories.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error =
                        action.payload;
                }
            )

            .addCase(createCategory.pending, (state) => {
                state.loading = true;
            })

            .addCase(createCategory.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
            })

            .addCase(updateCategory.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
            })

            .addCase(deleteCategory.fulfilled, (state) => {
                state.loading = false;
            })

            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default categorySlice.reducer;