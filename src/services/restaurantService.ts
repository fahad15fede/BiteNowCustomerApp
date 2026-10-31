import { MenuItem, Restaurant } from "../types";
import { apiRequest } from "./apiClient";

// GET /restaurants?search=...
export function getRestaurants(search?: string): Promise<Restaurant[]> {
  const term = search?.trim();
  const query = term ? `?search=${encodeURIComponent(term)}` : "";
  return apiRequest<Restaurant[]>(`/restaurants${query}`);
}

// GET /restaurants/{id}
export function getRestaurant(id: string): Promise<Restaurant> {
  return apiRequest<Restaurant>(`/restaurants/${id}`);
}

// GET /restaurants/{id}/menu
export function getMenu(restaurantId: string): Promise<MenuItem[]> {
  return apiRequest<MenuItem[]>(`/restaurants/${restaurantId}/menu`);
}