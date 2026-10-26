import { useMemo } from "react";
import { View, Text, Image, SectionList, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/types";
import { getMenuForRestaurant, groupMenuByCategory } from "../data/menu";
import MenuItemCard from "../components/MenuItemCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addItem, selectCartCount, selectCartTotal } from "../store/cartSlice"; // 🆕 selectCartTotal

// Restaurant lives directly in the ROOT STACK, so stack props are correct here
type Props = NativeStackScreenProps<RootStackParamList, "Restaurant">;

export default function RestaurantScreen({ route, navigation }: Props) {
  const { restaurant } = route.params;

  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal); // 🆕

  const sections = useMemo(
    () => groupMenuByCategory(getMenuForRestaurant(restaurant.id)),
    [restaurant.id]
  );

  // 🆕 Go BACK to the tabs, and land on the Cart tab
  const openCart = () => {
    navigation.popTo("Main", {
      screen: "Tabs",
      params: { screen: "CartTab" },
    });
  };

  return (
    <View style={styles.screen}>
      <SectionList
        style={styles.container}
        contentContainerStyle={styles.content}
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View>
            <Image source={{ uri: restaurant.image }} style={styles.cover} />
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text style={styles.info}>
              {restaurant.cuisine} · ⭐ {restaurant.rating} · {restaurant.deliveryTime}
            </Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <MenuItemCard item={item} onAdd={() => dispatch(addItem(item))} />
        )}
        ListEmptyComponent={<Text style={styles.info}>No menu items yet.</Text>}
      />

      {cartCount > 0 && (
        <Pressable style={styles.cartButton} onPress={openCart}>
          {/* 🆕 count badge · label · total */}
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
          <Text style={styles.cartButtonText}>View cart</Text>
          <Text style={styles.cartButtonText}>${cartTotal.toFixed(2)}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 20, paddingBottom: 110 },
  cover: { width: "100%", height: 180, borderRadius: 16 },
  title: { fontSize: 28, fontWeight: "700", marginTop: 16, color: "#222" },
  info: { fontSize: 15, color: "#777", marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#222", marginTop: 20, marginBottom: 12 },

  // 🆕 the button is now a row: [badge]  View cart  ........  $13.00
  cartButton: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 30,
    backgroundColor: "#FF5A5F",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartBadge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  cartBadgeText: { color: "#FFFFFF", fontWeight: "700" },
  cartButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});