# BiteNow project flow

The app uses React Navigation and fetches restaurant and menu data from the configured backend.

## Current app flow

```text
index.ts
  └─ App.tsx
      └─ AppNavigator
          ├─ Main
          │   ├─ Home tab
          │   │   ├─ HomeHeader ← authenticated user
          │   ├─ SearchBar
          │   ├─ CategoryChip list ← local categories
          │   └─ RestaurantCard list ← restaurant API
          │       └─ tap a restaurant
          │           └─ Restaurant ← menu API
          ├─ Cart tab
          ├─ Orders tab
          └─ Profile tab
              └─ Checkout ← from cart
```

The root stack, drawer, and tab navigation are defined in [src/navigation/](./src/navigation/). Home and Restaurant use [src/services/restaurantService.ts](./src/services/restaurantService.ts) to load restaurants and menus. Restaurant selection passes the selected restaurant through typed route params.

## Restaurant-to-order flow

```text
Home
  → search or select a category
  → choose a restaurant
  → browse its API-provided menu
  → add items to the Redux cart
  → review cart and checkout
  → create an order visible on the Orders tab
```
