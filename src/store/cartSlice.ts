import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, MenuItem } from "../types";
import { logoutUser } from "./authSlice";

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<MenuItem>) {
      const food = action.payload;
      const existing = state.items.find((c) => c.item.id === food.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ item: food, quantity: 1 });
      }
    },

    removeItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const existing = state.items.find((c) => c.item.id === id);
      if (!existing) return;

      existing.quantity -= 1;
      if (existing.quantity === 0) {
        state.items = state.items.filter((c) => c.item.id !== id);
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
    extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// ---- Selectors: small functions that READ from the store ----
type WithCart = { cart: CartState };

export const selectCartItems = (state: WithCart) => state.cart.items;

export const selectCartCount = (state: WithCart) =>
  state.cart.items.reduce((sum, c) => sum + c.quantity, 0);

export const selectCartTotal = (state: WithCart) =>
  state.cart.items.reduce((sum, c) => sum + c.item.price * c.quantity, 0);