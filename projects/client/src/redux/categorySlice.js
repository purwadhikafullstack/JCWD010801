import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        refresh: false
    }
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        refreshCategories: (state, action) => {
            state.value.refresh = !state.value.refresh;
        },
    },
});

export const { refreshCategories } = categorySlice.actions;
export default categorySlice.reducer;