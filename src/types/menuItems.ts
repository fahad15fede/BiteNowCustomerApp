// Matches MenuItemOut from the backend
export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number; // PKR
  imageUrl: string | null;
  category: string;
  isAvailable: boolean;
};