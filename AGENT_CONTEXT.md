# BiteNow Agent Context

This document summarizes the current project structure and configuration. It excludes generated dependency files (`package-lock.json`), binary assets, and `node_modules`.

## Current status

- Expo/React Native TypeScript app using Expo SDK 57.
- Home fetches restaurants from the API and supports debounced search and category queries.
- Restaurant details and menu are fetched from the API; menu items can be added to the Redux cart.
- The app includes drawer and tab navigation, cart, checkout, orders, and profile screens.
- The repository has uncommitted changes.

## `package.json`

```json
{
  "name": "bitenow",
  "version": "1.0.0",
  "main": "index.ts",
  "dependencies": {
    "@react-navigation/native": "^7.5.1",
    "@react-navigation/native-stack": "^7.21.0",
    "@reduxjs/toolkit": "^2.13.0",
    "expo": "~57.0.30",
    "expo-status-bar": "~57.0.1",
    "react": "19.2.3",
    "react-native": "0.86.3",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-redux": "^9.3.0"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "private": true
}
```

## `app.json`

```json
{
  "expo": {
    "name": "BiteNow",
    "slug": "BiteNow",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "ios": { "supportsTablet": true },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": { "favicon": "./assets/favicon.png" }
  }
}
```

## `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": { "strict": true }
}
```

## `index.ts`

```ts
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

## `App.tsx`

```tsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from "./src/screens/HomeScreen";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App(){
  return <AppNavigator/>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Current app architecture

- `src/screens/HomeScreen.tsx` loads restaurants with `getRestaurants` and uses local categories from `src/data/categories.ts`.
- `src/screens/RestaurantScreen.tsx` loads menu items with `getMenu`; `src/utils/menu.ts` groups them for display.
- `src/services/restaurantService.ts` provides the restaurant and menu API requests.
- `src/services/apiClient.ts` handles API requests, while `src/hooks/useFetch.ts` and `src/hooks/useDebounce.ts` support loading and search.
- Cart and order state are managed by Redux in `src/store/`.
- `src/navigation/` contains the root stack, drawer, and tab navigators.

## Important project instruction

The repository's `AGENTS.md` requires Expo Router for navigation (`src/app/` routes), while the current code uses React Navigation. An agent changing navigation should resolve this mismatch deliberately rather than mixing the two approaches.
