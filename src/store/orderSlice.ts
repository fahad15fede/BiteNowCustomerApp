import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order,} from "../types";
import { logoutUser } from "./authSlice";

type OrderState = {
    orders: Order[];
};

const initialState: OrderState={
    orders: [],
};


const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
        state.orders.unshift(action.payload);
      }
    },
        extraReducers: (builder) => {
      builder.addCase(logoutUser.fulfilled, () => initialState);
    },
  },
);

export const {addOrder} = orderSlice.actions;
export default orderSlice.reducer;

//selectors:Give me all orders
export const selectOrders = (state: {orders:OrderState})=>state.orders.orders;