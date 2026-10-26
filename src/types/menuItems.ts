export type MenuItem = {
  id: string;
  restaurantId: string; // ← new: points to Restaurant.id
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};