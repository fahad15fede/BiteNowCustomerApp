# BiteNow Agent Context

This document contains the complete current project code and configuration. It excludes generated dependency files (`package-lock.json`), binary assets, and `node_modules`.

## Current status

- Expo/React Native TypeScript app using Expo SDK 57.
- Home screen lists four mock restaurants.
- Native-stack navigation contains `Home` and `Restaurant` routes.
- Restaurant, cart, checkout, food card, API, and Redux work is incomplete; several corresponding files are empty placeholders.
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

## `src/types/restaurant.ts`

```ts
export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
};
```

## `src/types/index.ts`

```ts
export * from "./restaurant";
```

## `src/data/restaurants.ts`

```ts
import { Restaurant } from "../types/restaurant";

export const restaurants: Restaurant[] = [
  { id: "1", name: "KFC", cuisine: "Chicken", rating: 4.8 },
  { id: "2", name: "McDonald's", cuisine: "Burger", rating: 4.6 },
  { id: "3", name: "Pizza Hut", cuisine: "Pizza", rating: 4.7 },
  { id: "4", name: "Subway", cuisine: "Sandwich", rating: 4.5 },
];
```

## `src/navigation/types.ts`

```ts
export type RootStackParamList = {
  Home: undefined;
  Restaurant: undefined;
};
```

## `src/navigation/AppNavigator.tsx`

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import RestaurantScreen from "../screens/RestaurantScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Restaurant" component={RestaurantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## `src/components/RestaurantCard.tsx`

```tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Restaurant } from "../types";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
};

export default function RestaurantCard({ restaurant, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.title}>{restaurant.name}</Text>
        <Text>{restaurant.cuisine}</Text>
        <Text>Rating: {restaurant.rating}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F7F7F7",
    padding: 18,
    marginBottom: 15,
    borderRadius: 14,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
  },
});
```

## `src/screens/HomeScreen.tsx`

```tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { restaurants } from "../data/restaurants";
import RestaurantCard from "../components/RestaurantCard";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>BiteNow</Text>
      <Text style={styles.subtitle}>What would you like to eat today?</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  heading: { fontSize: 28, fontWeight: "bold", color: "#E84C3D" },
  subtitle: { fontSize: 16, marginVertical: 20 },
  card: { backgroundColor: "#F5F5F5", padding: 20, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "bold" },
});
```

## `src/screens/RestaurantScreen.tsx`

```tsx
import { View, Text } from "react-native";

export default function RestaurantScreen(){
  return (
    <View>
      <Text>Restaurant Screen</Text>
    </View>
  );
}
```

## Empty placeholder files

```text
src/components/FoodCard.tsx
src/screens/CartScreen.tsx
src/screens/CheckoutScreen.tsx
src/services/api.ts
src/store/cartSlice.ts
src/store/store.ts
```

## Important project instruction

The repository's `AGENTS.md` requires Expo Router for navigation (`src/app/` routes), while the current code uses React Navigation. An agent changing navigation should resolve this mismatch deliberately rather than mixing the two approaches.
