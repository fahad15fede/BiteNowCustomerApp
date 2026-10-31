import { useMemo } from "react";
import { View, Text, Image, SectionList, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../navigation/types";
import MenuItemCard from "../components/MenuItemCard";
import StatusView from "../components/StatusView";

import { getMenu } from "../services/restaurantService";
import { useFetch } from "../hooks/useFetch";
import { groupMenuByCategory } from "../utils/menu";
import { formatDeliveryFee, formatDeliveryTime, formatPrice } from "../utils/format";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addItem, selectCartCount, selectCartTotal } from "../store/cartSlice";

type Props = NativeStackScreenProps<RootStackParamList, "Restaurant">;

export default function RestaurantScreen({ route, navigation }: Props) {
  // The restaurant came from Home → show its info instantly, no need to load it again
  const { restaurant } = route.params;

  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);

  // 🆕 The menu comes from the server
  const { data: menu, loading, error, refetch } = useFetch(
    () => getMenu(restaurant.id),
    [restaurant.id]
  );

  const sections = useMemo(() => groupMenuByCategory(menu ?? []), [menu]);

  const openCart = () => {
    navigation.popTo("Main", { screen: "Tabs", params: { screen: "CartTab" } });
  };

  const renderEmpty = () => {
    if (loading) return <StatusView type="loading" />;
    if (error) return <StatusView type="error" message={error} onRetry={refetch} />;
    return (
      <StatusView
        type="empty"
        icon="restaurant-outline"
        title="No dishes available"
        message="This restaurant hasn't added anything yet."
      />
    );
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
            {/* Cover image, or a placeholder if there isn't one */}
            {restaurant.imageUrl ? (
              <Image source={{ uri: restaurant.imageUrl }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.coverPlaceholder]}>
                <Ionicons name="restaurant-outline" size={48} color="#CCCCCC" />
              </View>
            )}

            <Text style={styles.title}>{restaurant.name}</Text>
            <Text style={styles.info}>
              {restaurant.cuisine} · ⭐ {restaurant.rating.toFixed(1)}
            </Text>
            <Text style={styles.info}>
              {formatDeliveryTime(restaurant.deliveryTimeMin, restaurant.deliveryTimeMax)} ·{" "}
              {formatDeliveryFee(restaurant.deliveryFee)}
            </Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <MenuItemCard item={item} onAdd={() => dispatch(addItem(item))} />
        )}
        ListEmptyComponent={renderEmpty}
      />

      {cartCount > 0 && (
        <Pressable style={styles.cartButton} onPress={openCart}>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
          <Text style={styles.cartButtonText}>View cart</Text>
          <Text style={styles.cartButtonText}>{formatPrice(cartTotal)}</Text>
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
  coverPlaceholder: {
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "700", marginTop: 16, color: "#222" },
  info: { fontSize: 15, color: "#777", marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#222", marginTop: 20, marginBottom: 12 },
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