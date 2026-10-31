import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DrawerNavigator from "./DrawerNavigator";
import RestaurantScreen from "../screens/RestaurantScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { restoreSession, selectIsLoggedIn, selectIsRestoring } from "../store/authSlice";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: "#FF5A5F", background: "#FFFFFF" },
};

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isRestoring = useAppSelector(selectIsRestoring);

  // 🆕 Once, when the app opens: check for a saved login
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // 🆕 While checking, show a loader (not Login, not Home)
  if (isRestoring) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

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
          <Stack.Group>
            <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
            <Stack.Screen
              name="Restaurant"
              component={RestaurantScreen}
              options={({ route }) => ({ title: route.params.restaurant.name })}
            />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Checkout" }} />
          </Stack.Group>
        ) : (
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

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});