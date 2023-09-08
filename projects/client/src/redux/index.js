import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import categorySlice from "./categorySlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        category: categorySlice
    }
});