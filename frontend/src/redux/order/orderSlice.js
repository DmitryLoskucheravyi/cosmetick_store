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
    async (payload, thunkAPI) => {
        try {

            const response = await api.post(
                '/orders',
                payload
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const applyPromoCode = createAsyncThunk(
    'orders/applyPromoCode',
    async ({ code, subtotal }, thunkAPI) => {
        try {

            const response = await api.post(
                '/promo/validate',
                { code, subtotal }
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                'Invalid promo code'
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
                `/orders/${data.orderId}/status`,
                { status: data.status }
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

export const getOrderById = createAsyncThunk(
    'orders/getOrderById',
    async (id, thunkAPI) => {
        try {

            const response = await api.get(
                `/orders/${id}`
            );

            return response.data.data;

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
        selectedOrder: null,
        loading: false,
        error: null,
        promo: {
            code: null,
            percent: 0,
            discount: 0,
            applying: false,
            error: null,
        },
    },

    reducers: {
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },
        clearPromo: (state) => {
            state.promo = {
                code: null,
                percent: 0,
                discount: 0,
                applying: false,
                error: null,
            };
        },
    },

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
            .addCase(
                getOrderById.pending,
                (state) => {

                    state.loading = true;
                }
            )

            .addCase(
                getOrderById.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.selectedOrder =
                        action.payload;
                }
            )

            .addCase(
                getOrderById.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error =
                        action.payload;
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

            .addCase(applyPromoCode.pending, (state) => {

                state.promo.applying = true;
                state.promo.error = null;
            })

            .addCase(applyPromoCode.fulfilled, (state, action) => {

                state.promo.applying = false;
                state.promo.code = action.payload.code;
                state.promo.percent = action.payload.percent;
                state.promo.discount = action.payload.discount;
                state.promo.error = null;
            })

            .addCase(applyPromoCode.rejected, (state, action) => {

                state.promo.applying = false;
                state.promo.code = null;
                state.promo.percent = 0;
                state.promo.discount = 0;
                state.promo.error = action.payload;
            })
    },
});

export default orderSlice.reducer;

export const {
    clearSelectedOrder,
    clearPromo,
} = orderSlice.actions;