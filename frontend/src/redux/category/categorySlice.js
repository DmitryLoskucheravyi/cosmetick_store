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
            );
    },
});

export default categorySlice.reducer;