import { Order, OrderCreateRequest } from "../types";
import { apiRequest } from "./apiClient";

// POST /orders: the server checks every dish and calculates every price
export function placeOrder(data: OrderCreateRequest): Promise<Order> {
  return apiRequest<Order>("/orders", { method: "POST", body: data });
}

// GET /orders/me: only MY orders, newest first
export function getMyOrders(): Promise<Order[]> {
  return apiRequest<Order[]>("/orders/me");
}

// GET /orders/{id}: one of MY orders
export function getOrder(id: string): Promise<Order> {
  return apiRequest<Order>(`/orders/${id}`);
}