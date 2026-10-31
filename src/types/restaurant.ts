// Matches RestaurantOut from the backend (camelCase via CamelModel)
export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  imageUrl: string | null;
  address: string | null;
  rating: number;
  deliveryTimeMin: number; // minutes
  deliveryTimeMax: number;
  deliveryFee: number;     // PKR, 0 = free
  isOpen: boolean;
};