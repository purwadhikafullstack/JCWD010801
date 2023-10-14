import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: {},
};

const addressSlice = createSlice({
	name: "address",
	initialState,
	reducers: {
		setValueAddress: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setValueAddress } = addressSlice.actions;
export default addressSlice.reducer;
