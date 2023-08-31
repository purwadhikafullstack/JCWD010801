import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
    }
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setValue: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setValue } = userSlice.actions;
export default userSlice.reducer;