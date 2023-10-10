import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import categorySlice from "./categorySlice";
import cartSlice from "./cartSlice";
import voucherSlice from "./voucherSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        category: categorySlice,
        cart: cartSlice,
        voucher: voucherSlice
    }
});