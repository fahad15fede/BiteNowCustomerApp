import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DrawerNavigator from "./DrawerNavigator";
import RestaurantScreen from "../screens/RestaurantScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import { useAppSelector } from "../store/hooks";
import { selectIsLoggedIn } from "../store/authSlice";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF5A5F",
    background: "#FFFFFF",
  },
};

export default function AppNavigator() {
  // The ONE question that decides which pages exist
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "#222222",
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        {isLoggedIn ? (
          // ── LOGGED IN: the app ──
          <Stack.Group>
            <Stack.Screen
              name="Main"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Restaurant"
              component={RestaurantScreen}
              options={({ route }) => ({ title: route.params.restaurant.name })}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ title: "Checkout" }}
            />
          </Stack.Group>
        ) : (
          // ── LOGGED OUT: only login and register ──
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ animationTypeForReplace: "pop" }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}