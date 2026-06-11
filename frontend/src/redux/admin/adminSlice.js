import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';

import api from '../../api/axios';

export const getDashboard = createAsyncThunk(
    'admin/getDashboard',
    async (_, thunkAPI) => {
        try {

            const response = await api.get(
                '/admin/dashboard'
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',

    initialState: {
        dashboard: null,
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(
                getDashboard.pending,
                (state) => {

                    state.loading = true;
                }
            )

            .addCase(
                getDashboard.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.dashboard =
                        action.payload;
                }
            )

            .addCase(
                getDashboard.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error =
                        action.payload;
                }
            );
    },
});

export default adminSlice.reducer;