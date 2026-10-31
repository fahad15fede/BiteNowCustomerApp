# BiteNow

BiteNow is a food-ordering app built with Expo, React Native, and TypeScript. It lets users browse restaurants and menus, manage a shopping cart, complete a mock checkout, and view orders created during the current app session.

> **Prototype status:** Restaurant and menu data are loaded through the configured API. Cart and order state use an in-memory Redux store; checkout does not process real payments.

## Contents

- [Features](#features)
- [App flow](#app-flow)
- [Technology](#technology)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Run the app](#run-the-app)
- [Project structure](#project-structure)
- [How the app works](#how-the-app-works)
- [Data sources](#data-sources)
- [Current limitations](#current-limitations)
- [Validation](#validation)
- [Contributing](#contributing)

## Features

- Browse restaurants on the Home screen.
- Search restaurants and filter by category through the restaurant API.
- Open a restaurant to see its menu grouped by category.
- Add menu items to a shared cart, increase quantities, or remove items.
- Review a bill summary and proceed to checkout.
- Enter a delivery address and choose a mock payment option: cash on delivery or card.
- Create an order and view it on the Orders tab.
- Access Home, Cart, Orders, and Profile from bottom tabs and the side drawer.
- See sample user contact information and cart shortcuts on the Profile screen.

## App flow

```text
Home
 ├─ Search or select a category
 └─ Select a restaurant
     └─ Restaurant menu
         └─ Add menu items
             └─ Cart
                 └─ Checkout
                     └─ Order confirmation
                         └─ Orders tab
```

The root native stack contains the main drawer, Restaurant details, and Checkout. The drawer contains the bottom-tab navigator. The Restaurant and Checkout screens are presented above the tabs.

## Technology

- **Expo SDK 57** with React Native 0.86 and React 19
- **TypeScript** with strict checking enabled
- **React Navigation 7**: native stack, drawer, and bottom tabs
- **Redux Toolkit** and React Redux for cart and order state
- Expo vector icons, safe-area context, gesture handler, and screens

## Requirements

- Node.js and npm
- Expo Go on a compatible phone for quick device testing, or an emulator/simulator with the relevant platform tooling
- A network connection to install packages and load the sample images, which are remote URLs

The repository includes `package-lock.json`, so npm is the package manager used for the documented setup. Restaurant and menu browsing require a reachable, configured API.

## Getting started

1. Clone the repository and open its root directory:

   ```sh
   git clone <repository-url>
   cd BiteNow
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the Expo development server:

   ```sh
   npx expo start
   ```

4. Scan the displayed QR code with Expo Go, or choose an available emulator or web target from the Expo CLI.

If your phone cannot connect to the development server over the local network, confirm both devices are on the same network or use the Expo CLI's available connection options.

## Run the app

These scripts are defined in `package.json`:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Start Expo and open the Android target |
| `npm run ios` | Start Expo and open the iOS target |
| `npm run web` | Start Expo for web |

The equivalent Expo CLI commands are `npx expo start`, `npx expo start --android`, `npx expo start --ios`, and `npx expo start --web`.

## Project structure

```text
.
├── App.tsx                      # Providers and application root
├── index.ts                     # Expo entry point
├── app.json                     # Expo app metadata and platform assets
├── assets/                      # App icon, splash, and web/Android icons
└── src/
    ├── components/              # Reusable UI: cards, chips, search, drawer
    ├── constants/               # Shared constants (currently empty)
    ├── data/                    # Local category data
    ├── hooks/                    # Shared data-fetching and debounce hooks
    ├── navigation/              # Typed stack, drawer, and tab navigation
    ├── screens/                 # Home, Restaurant, Cart, Checkout, Orders, Profile
    ├── services/                # API client and restaurant/auth services
    ├── store/                   # Redux store, typed hooks, cart and order slices
    ├── types/                   # Shared TypeScript data types
    └── utils/                   # Menu grouping and formatting helpers
```

### Important files

| File | Responsibility |
| --- | --- |
| `App.tsx` | Wraps the app in gesture handling, safe-area, and Redux providers |
| `src/navigation/AppNavigator.tsx` | Sets up the root stack and shared navigation theme |
| `src/navigation/DrawerNavigator.tsx` | Provides the side drawer around the tabs |
| `src/navigation/TabNavigator.tsx` | Registers Home, Cart, Orders, and Profile |
| `src/navigation/types.ts` | Declares typed route parameter lists |
| `src/store/store.ts` | Configures the Redux store with cart and order reducers |
| `src/store/cartSlice.ts` | Cart actions and selectors |
| `src/store/orderSlice.ts` | Order action and selector |
| `src/services/restaurantService.ts` | Fetches restaurants and their menus from the API |
| `src/services/apiClient.ts` | Shared API request handling |
| `src/data/categories.ts` | Local categories shown on Home |

## How the app works

### Navigation

`index.ts` registers `App.tsx` with Expo. `App.tsx` supplies the global providers and renders `AppNavigator`. `AppNavigator` owns the native stack:

- `Main`: the drawer with the bottom tabs
- `Restaurant`: details and menu for a selected restaurant
- `Checkout`: address, payment selection, order summary, and confirmation

The drawer and bottom tabs provide the main destinations: Home, Cart, Orders, and Profile. Navigation parameter types live in `src/navigation/types.ts`.

### Home and restaurant browsing

`HomeScreen` combines the header, search field, category chips, and restaurant list. It debounces the search or selected category and requests matching restaurants through `getRestaurants` in `src/services/restaurantService.ts`. Selecting a restaurant passes its data to `RestaurantScreen`.

`RestaurantScreen` loads the selected restaurant's menu from the API, groups items by menu category, and dispatches cart actions when an item is added. If the cart has items, a shortcut opens the Cart tab.

### Cart and checkout

The Redux cart state is held under `state.cart`. Adding an item increments its quantity if it is already in the cart; otherwise, it creates a cart row. Removing an item decreases the quantity and removes the row when its quantity reaches zero. Cart selectors provide the item list, total item count, and subtotal.

Checkout validates that an address has been entered and presents the available mock payment choices. Placing an order copies the current cart items and total into an order, adds it to the orders state, then clears the cart. The order timestamp is stored as an ISO date string so Redux actions and state remain serializable.

### Orders and profile

Orders are stored newest first in `state.orders` and displayed on the Orders tab. Profile details come from the local `currentUser` sample object; profile shortcuts navigate to the Cart and Home tabs.

### State lifetime

The Redux store is configured in memory and is not backed by a database or local storage. Cart and order data therefore reset when the app process is restarted or the store is reinitialized.

## Data sources

- Restaurant and menu data are fetched from the configured backend using `src/services/restaurantService.ts`.
- `src/data/categories.ts` provides the categories shown on Home.

Restaurant and menu images are loaded from external image URLs and require network access.

## Current limitations

- Restaurant and menu browsing depend on the backend being available and correctly configured.
- The displayed Card option does not collect card details or charge a payment method.
- Order confirmation is local to the running app; it is not sent to a restaurant or delivery service.
- Delivery fees are currently treated as free in the cart and checkout totals.
- Cart and orders are not persisted across app restarts.
- No automated test suite is configured yet.
- Some category choices may return no restaurants when the backend has no matching restaurants.

## Validation

Run the TypeScript checker:

```sh
npx tsc --noEmit
```

Run Expo's lint command:

```sh
npx expo lint
```

Linting may prompt to create an ESLint configuration if one is not already present in the working copy.

## Contributing

When adding a screen or navigation destination, update the corresponding route parameter types and register it in the appropriate navigator. Keep shared UI in `src/components/`, local category data in `src/data/`, API integration in `src/services/`, app state in `src/store/`, and shared types in `src/types/`.

Before submitting changes, run the type check and lint command above. Do not commit credentials, payment data, or other secrets.
