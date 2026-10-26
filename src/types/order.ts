import { CartItem } from "./cart";

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: "cash" | "card";
  address: string;
  createdAt: string;
  status: string;
};