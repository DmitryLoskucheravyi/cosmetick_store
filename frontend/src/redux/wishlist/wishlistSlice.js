import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'pomu_wishlist';

// Guest-only MVP: wishlist lives in localStorage, not the backend (no
// endpoint for it yet). Snapshots the fields the UI needs at add-time so
// the wishlist page never has to refetch products just to render itself.
const loadFromStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveToStorage = (items) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Storage unavailable (private mode, quota) — wishlist just won't persist.
    }
};

const snapshot = (product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    categoryName: product.categoryName,
    stock: product.stock,
});

const wishlistSlice = createSlice({
    name: 'wishlist',

    initialState: {
        items: loadFromStorage(),
    },

    reducers: {
        addToWishlist: (state, action) => {
            if (!state.items.some((item) => item.id === action.payload.id)) {
                state.items.push(snapshot(action.payload));
                saveToStorage(state.items);
            }
        },

        removeFromWishlist: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            saveToStorage(state.items);
        },

        toggleWishlist: (state, action) => {
            const product = action.payload;
            const exists = state.items.some((item) => item.id === product.id);

            state.items = exists
                ? state.items.filter((item) => item.id !== product.id)
                : [...state.items, snapshot(product)];

            saveToStorage(state.items);
        },
    },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
