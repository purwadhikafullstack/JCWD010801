import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import categorySlice from "./categorySlice";
import cartSlice from "./cartSlice";
import addressSlice from "./addressSlice";

export const store = configureStore({
	reducer: {
		user: userSlice,
		category: categorySlice,
		cart: cartSlice,
		address: addressSlice,
	},
});
