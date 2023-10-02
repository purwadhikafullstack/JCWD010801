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
        },
        useLater: (state, action) => {
            state.value = {}
        }
    }
});

export const { setVoucherInfo, useLater } = voucherSlice.actions;
export default voucherSlice.reducer;