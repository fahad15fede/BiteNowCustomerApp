import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Avatar from "./Avatar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectCartCount } from "../store/cartSlice";
import { selectUser, logoutUser } from "../store/authSlice";
import { TabParamList } from "../navigation/types";

type IconName = keyof typeof Ionicons.glyphMap;

type MenuLink = {
  label: string;
  icon: IconName;
  tab: keyof TabParamList;
};

const links: MenuLink[] = [
  { label: "Home", icon: "home-outline", tab: "HomeTab" },
  { label: "My Cart", icon: "cart-outline", tab: "CartTab" },
  { label: "My Orders", icon: "receipt-outline", tab: "OrderTab" },
  { label: "Profile", icon: "person-outline", tab: "ProfileTab" },
];

export default function DrawerContent({ state, navigation }: DrawerContentComponentProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);          // 🆕 the REAL logged-in user
  const cartCount = useAppSelector(selectCartCount);
  const insets = useSafeAreaInsets();

  const tabsRoute = state.routes[state.index];
  const activeTab = getFocusedRouteNameFromRoute(tabsRoute) ?? "HomeTab";

  // 🆕 Safety: no user → draw nothing (can only happen for a split second at logout)
  if (!user) return null;

  const goTo = (tab: keyof TabParamList) => {
    navigation.navigate("Tabs", { screen: tab });
    navigation.closeDrawer();
  };

  // 🆕 Close the menu, then log out. AppNavigator swaps to Login by itself.
  const handleLogout = () => {
    navigation.closeDrawer();
    dispatch(logoutUser());
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView contentContainerStyle={styles.scroll}>
        {/* 1. Profile header: now from the store */}
        <View style={styles.profile}>
          <Avatar name={user.name} imageUrl={user.profilePicture} size={64} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* 2. Menu links */}
        {links.map((link) => {
          const isActive = activeTab === link.tab;
          return (
            <Pressable
              key={link.tab}
              style={[styles.link, isActive && styles.linkActive]}
              onPress={() => goTo(link.tab)}
            >
              <Ionicons name={link.icon} size={22} color={isActive ? "#FF5A5F" : "#444444"} />
              <Text style={[styles.linkText, isActive && styles.linkTextActive]}>
                {link.label}
              </Text>
              {link.tab === "CartTab" && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </DrawerContentScrollView>

      {/* 3. 🆕 Footer: log out + version */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#D93025" />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
        <Text style={styles.version}>BiteNow v1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { paddingHorizontal: 12 },
  profile: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 24,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  name: { fontSize: 20, fontWeight: "700", color: "#222222", marginTop: 12 },
  email: { fontSize: 14, color: "#777777", marginTop: 2 },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  linkActive: { backgroundColor: "#FFF0F0" },
  linkText: { flex: 1, fontSize: 16, fontWeight: "600", color: "#444444", marginLeft: 14 },
  linkTextActive: { color: "#FF5A5F" },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  logout: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  logoutText: { fontSize: 16, fontWeight: "600", color: "#D93025", marginLeft: 14 },
  version: { textAlign: "center", color: "#AAAAAA", fontSize: 13, marginTop: 8 },
});