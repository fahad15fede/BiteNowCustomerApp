import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

import CartScreen from "../screens/CartScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { TabParamList } from "./types";
import OrdersScreen from "../screens/OrderScreen";

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerLeft: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
            style={{ paddingHorizontal: 16 }}
          >
            <Ionicons name="menu-outline" size={24} color="#222222" />
          </Pressable>
        ),
        tabBarActiveTintColor: "#FF5A5F",
        tabBarInactiveTintColor: "#777777",
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OrderTab"
        component={OrdersScreen}
        options={{
          title: "My Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
