# BiteNow project flow

## How the project started

1. **Expo starter app** — The first commit (`e46b77f`, “Initial commit”) set up the Expo and React Native TypeScript app, its assets, and the app entry point.
2. **First BiteNow experience** — The next commit (`c0abd0e`, “Add navigation, home screen, restaurant cards, mock data”) introduced the initial restaurant list, mock restaurant data, reusable restaurant cards, and a Home/Restaurant navigation stack.
3. **Current UI expansion** — The working tree now also contains a richer home screen with a header, search bar, category chips, and restaurant cards, plus mock user, category, and menu data and a menu-item card.

## Current app flow

```text
index.ts
  └─ App.tsx
      └─ AppNavigator
          ├─ Home
          │   ├─ HomeHeader ← currentUser
          │   ├─ SearchBar
          │   ├─ CategoryChip list ← categories
          │   └─ RestaurantCard list ← restaurants
          │       └─ tap a restaurant
          │           └─ Restaurant
          │               └─ shows restaurant name, cuisine, rating, and delivery time
          └─ Restaurant
```

The navigation stack is defined in [src/navigation/AppNavigator.tsx](./src/navigation/AppNavigator.tsx), and the Home screen is in [src/screens/HomeScreen.tsx](./src/screens/HomeScreen.tsx). Restaurant selection passes the selected restaurant through the typed route params in [src/navigation/types.ts](./src/navigation/types.ts).

## Where the project is now

### Working path

- The app launches into the Home screen through the app entry point and native-stack navigator.
- Home renders mock user details, a search field, categories, and four restaurants.
- Tapping a restaurant navigates to its details screen.
- Restaurant and menu item data have TypeScript types; mock data is stored locally.

### Not connected or not implemented yet

- Search and category controls are presentational; filtering is not wired up.
- The Restaurant screen currently shows restaurant details only. It does not yet display menu items.
- [src/components/MenuItemCard.tsx](./src/components/MenuItemCard.tsx) and the menu data in [src/data/menu.ts](./src/data/menu.ts) exist, but are not connected to the Restaurant screen.
- Cart and checkout screens are still empty and are not registered in the navigator.
- The cart slice, Redux store, and API service files are empty placeholders, so there is no add-to-cart, checkout, or backend flow yet.

## Next app flow to build

```text
Home
  → choose restaurant
  → browse that restaurant's menu
  → add menu items to cart
  → review and update cart
  → checkout
```

The next functional milestone is to connect restaurant-specific menu items to the Restaurant screen, then implement shared cart state and register Cart and Checkout navigation routes.
