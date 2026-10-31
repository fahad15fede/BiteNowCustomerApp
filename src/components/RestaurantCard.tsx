import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Restaurant } from "../types";
import FoodImage from "./FoodImage";
import { formatDeliveryFee, formatDeliveryTime } from "../utils/format";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
};

export default function RestaurantCard({ restaurant, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <FoodImage uri={restaurant.imageUrl} style={styles.image} icon="restaurant-outline" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Text style={styles.rating}>⭐ {restaurant.rating.toFixed(1)}</Text>
        </View>

        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>

        <View style={styles.footer}>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="#777" />
            <Text style={styles.info}>
              {formatDeliveryTime(restaurant.deliveryTimeMin, restaurant.deliveryTimeMax)}
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="bicycle-outline" size={16} color="#777" />
            <Text style={[styles.info, restaurant.deliveryFee === 0 && styles.free]}>
              {formatDeliveryFee(restaurant.deliveryFee)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  image: { width: "100%", height: 170 },
  content: { padding: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { flex: 1, fontSize: 20, fontWeight: "700", color: "#222", marginRight: 10 },
  rating: { fontWeight: "700", color: "#222" },
  cuisine: { marginTop: 6, color: "#777" },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  row: { flexDirection: "row", alignItems: "center" },
  info: { marginLeft: 5, color: "#777" },
  free: { color: "#2E9E5B", fontWeight: "600" },
});