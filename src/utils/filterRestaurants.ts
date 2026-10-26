import { Restaurant } from "../types";
import { getMenuForRestaurant } from "../data/menu";

// "Pizza Hut" contains "pizza"? → true (ignores capital letters)
const matches = (text: string, query: string) =>
  text.toLowerCase().includes(query.toLowerCase());

export function filterRestaurants(
  list: Restaurant[],
  search: string,
  category: string | null
): Restaurant[] {
  const query = search.trim();

  return list.filter((restaurant) => {
    const menu = getMenuForRestaurant(restaurant.id);

    // Search: restaurant name, cuisine, or any food on its menu
    const matchesSearch =
      query === "" ||
      matches(restaurant.name, query) ||
      matches(restaurant.cuisine, query) ||
      menu.some((item) => matches(item.name, query));

    // Category: the cuisine, or any menu item in/named after that category
    const matchesCategory =
      category === null ||
      matches(restaurant.cuisine, category) ||
      menu.some((item) => matches(item.category, category) || matches(item.name, category));

    // Keep the restaurant only if BOTH are true
    return matchesSearch && matchesCategory;
  });
}