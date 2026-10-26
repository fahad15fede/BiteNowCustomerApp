import { MenuItem } from "../types/menuItems";

export const menuItems: MenuItem[] = [
  {
    id: "kfc-1",
    restaurantId: "1", // KFC
    name: "Zinger Burger",
    description: "Spicy chicken burger",
    price: 5,
    image: "https://picsum.photos/seed/zinger/400/300",
    category: "Popular",
  },
  {
    id: "kfc-2",
    restaurantId: "1",
    name: "French Fries",
    description: "Crispy potato fries",
    price: 3,
    image: "https://picsum.photos/seed/fries/400/300",
    category: "Sides",
  },
  {
    id: "mcd-1",
    restaurantId: "2", // McDonald's
    name: "Big Mac",
    description: "Two beef patties, special sauce",
    price: 6,
    image: "https://picsum.photos/seed/bigmac/400/300",
    category: "Burgers",
  },
  {
    id: "pizzahut-1",
    restaurantId: "3",
    name: "Pepperoni Lover's Pizza",
    description: "Classic pizza topped with pepperoni and mozzarella",
    price: 14,
    image: "https://picsum.photos/seed/pepperoni-pizza/400/300",
    category: "Pizza",
  },
  {
    id: "pizzahut-2",
    restaurantId: "3",
    name: "Veggie Supreme Pizza",
    description: "Bell peppers, onions, mushrooms, and olives",
    price: 13,
    image: "https://picsum.photos/seed/veggie-pizza/400/300",
    category: "Pizza",
  },
  {
    id: "subway-1",
    restaurantId: "4",
    name: "Italian B.M.T.",
    description: "Salami, pepperoni, and ham with fresh vegetables",
    price: 9,
    image: "https://picsum.photos/seed/italian-sub/400/300",
    category: "Sandwiches",
  },
  {
    id: "subway-2",
    restaurantId: "4",
    name: "Chicken Teriyaki Sub",
    description: "Teriyaki-glazed chicken with crisp vegetables",
    price: 9,
    image: "https://picsum.photos/seed/teriyaki-sub/400/300",
    category: "Sandwiches",
  },
];

// Get only one restaurant's items
export const getMenuForRestaurant = (restaurantId: string) =>
  menuItems.filter((item) => item.restaurantId === restaurantId);

// Turn a flat list into sections: [{ title: "Popular", data: [...] }, ...]
export const groupMenuByCategory = (items: MenuItem[]) => {
  const sections: { title: string; data: MenuItem[] }[] = [];

  for (const item of items) {
    let section = sections.find((s) => s.title === item.category);
    if (!section) {
      section = { title: item.category, data: [] };
      sections.push(section);
    }
    section.data.push(item);
  }

  return sections;
};