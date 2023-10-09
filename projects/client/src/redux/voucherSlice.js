import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {}
};

const voucherSlice = createSlice({
    name: "voucher",
    initialState,
    reducers: {
        setVoucherInfo: (state, action) => {
            state.value = action.payload
        }
    }
});

export const { setVoucherInfo } = voucherSlice.actions;
export default voucherSlice.reducer;