import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';


export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, thunkAPI) => {
        try {

            const response = await api.get('/auth/me');

            return response.data.data;

        } catch (error) {

            localStorage.removeItem('token');

            return thunkAPI.rejectWithValue(
                'Session expired'
            );
        }
    }
);


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, thunkAPI) => {
        try {
            const response = await api.post(
                '/auth/login',
                userData
            );

            localStorage.setItem(
                'token',
                response.data.data.token
            );

            return response.data.data.user;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                'Login failed'
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, thunkAPI) => {
        try {

            const response = await api.post(
                '/auth/register',
                userData
            );

            localStorage.setItem(
                'token',
                response.data.data.token
            );

            return response.data.data.user;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                'Registration failed'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',

    initialState: {
        user: null,
        loading: false,
        error: null,
        loadingUser: true,
    },

    reducers: {
        logout(state) {
            state.user = null;

            localStorage.removeItem('token');
        },
    },

    extraReducers: (builder) => {

        builder

            .addCase(loginUser.pending, (state) => {

                state.loading = true;
                state.error = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {

                state.loading = false;
                state.user = action.payload;
            })

            .addCase(loginUser.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;
            })

            .addCase(loadUser.pending, (state) => {

                state.loadingUser = true;
            })

            .addCase(loadUser.fulfilled, (state, action) => {

                state.loadingUser = false;
                state.user = action.payload;
            })

            .addCase(loadUser.rejected, (state) => {

                state.loadingUser = false;
                state.user = null;
            })

            .addCase(registerUser.pending, (state) => {

                state.loading = true;
                state.error = null;
            })

            .addCase(registerUser.fulfilled, (state, action) => {

                state.loading = false;
                state.user = action.payload;
            })

            .addCase(registerUser.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;