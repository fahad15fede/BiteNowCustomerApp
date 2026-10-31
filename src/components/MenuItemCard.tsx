import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { MenuItem } from "../types";
import FoodImage from "./FoodImage";
import { formatPrice } from "../utils/format";

type Props = {
  item: MenuItem;
  onAdd: () => void;
};

export default function MenuItemCard({ item, onAdd }: Props) {
  return (
    <View style={styles.card}>
      <FoodImage uri={item.imageUrl} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          <Pressable style={styles.addButton} onPress={onAdd} accessibilityLabel={`Add ${item.name}`}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: 110, height: 120 },
  content: { flex: 1, padding: 12, justifyContent: "space-between" },
  name: { fontSize: 17, fontWeight: "700", color: "#222" },
  description: { fontSize: 13, color: "#777", marginTop: 4 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  price: { fontSize: 17, fontWeight: "700", color: "#FF5A5F" },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
  },
});