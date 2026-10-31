// Matches the backend's OrderOut / OrderCreate schemas

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready_for_pickup"
  | "picked_up"
  | "delivered"
  | "rejected"
  | "cancelled";

export type PaymentMethod = "cash" | "card";

export type OrderLine = {
  id: string;
  menuItemId: string;
  nameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  restaurant: { id: string; name: string; imageUrl: string | null };
  items: OrderLine[];
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string; // ISO date text, e.g. "2026-10-31T06:40:12.345Z"
};

// What the app SENDS: no prices!
export type OrderCreateRequest = {
  restaurantId: string;
  items: { menuItemId: string; quantity: number }[];
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
};