import { View, Text, StyleSheet, Pressable } from "react-native";
import { Restaurant } from "../types";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
};

export default function RestaurantCard({
  restaurant,
  onPress,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.title}>{restaurant.name}</Text>

        <Text>{restaurant.cuisine}</Text>

        <Text>⭐ {restaurant.rating}</Text>
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