import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getProductReviews = createAsyncThunk(
    'reviews/getProductReviews',
    async (productId, thunkAPI) => {
        try {

            const response = await api.get(
                `/products/${productId}/reviews`
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message
            );
        }
    }
);

export const createReview = createAsyncThunk(
    'reviews/createReview',
    async ({ productId, rating, comment }, thunkAPI) => {
        try {

            const response = await api.post(
                `/products/${productId}/reviews`,
                { rating, comment }
            );

            return response.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Could not post review'
            );
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',

    initialState: {
        productId: null,
        reviews: [],
        summary: { average: 0, count: 0 },
        loading: false,
        submitting: false,
        error: null,
    },

    reducers: {
        resetReviews: (state) => {
            state.productId = null;
            state.reviews = [];
            state.summary = { average: 0, count: 0 };
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        builder

            .addCase(getProductReviews.pending, (state) => {
                state.loading = true;
            })

            .addCase(getProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
                state.summary = action.payload.summary;
            })

            .addCase(getProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createReview.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })

            .addCase(createReview.fulfilled, (state, action) => {
                state.submitting = false;
                state.reviews = [action.payload, ...state.reviews];
                state.summary = {
                    count: state.summary.count + 1,
                    average:
                        Math.round(
                            ((state.summary.average * state.summary.count + action.payload.rating) /
                                (state.summary.count + 1)) *
                                10
                        ) / 10,
                };
            })

            .addCase(createReview.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });
    },
});

export const { resetReviews } = reviewSlice.actions;

export default reviewSlice.reducer;
