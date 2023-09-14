import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        refresh: false
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        refreshCart: (state, action) => {
            state.value.refresh = !state.value.refresh;
        },
    },
});

export const { refreshCart } = cartSlice.actions;
export default cartSlice.reducer;