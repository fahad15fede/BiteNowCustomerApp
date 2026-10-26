import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer, // the cart lives at state.cart
    orders: orderReducer,
    auth: authReducer,
  },
});

// Types so TypeScript knows what's inside the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;