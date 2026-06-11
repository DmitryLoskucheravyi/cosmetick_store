import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getMyOrders = createAsyncThunk(
    'orders/getMyOrders',
    async (_, thunkAPI) => {
        try {

            const response = await api.get(
                '/orders/my'
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (_, thunkAPI) => {
        try {

            const response = await api.post(
                '/orders/create'
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const getAllOrders = createAsyncThunk(
    'orders/getAllOrders',
    async (_, thunkAPI) => {
        try {

            const response = await api.get(
                '/orders'
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async (data, thunkAPI) => {
        try {

            const response = await api.put(
                '/orders/status',
                data
            );

            thunkAPI.dispatch(
                getAllOrders()
            );

            return response.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);


const orderSlice = createSlice({
    name: 'orders',

    initialState: {
        orders: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(getMyOrders.pending, (state) => {

                state.loading = true;
            })

            .addCase(
                getMyOrders.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.orders = action.payload;
                }
            )

            .addCase(
                getMyOrders.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;
                }
            )

            .addCase(getAllOrders.pending, (state) => {

                state.loading = true;
            })

            .addCase(getAllOrders.fulfilled, (state, action) => {

                state.loading = false;
                state.orders = action.payload;
            })

            .addCase(getAllOrders.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default orderSlice.reducer;