import React from "react";
import {
  View,
  Text,
 Image,
  Pressable,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { MenuItem } from "../types";

type Props = {
  item: MenuItem;
  onAdd: () => void;
};

export default function MenuItemCard({
  item,
  onAdd,
}: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.description}>
          {item.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ${item.price.toFixed(2)}
          </Text>

          <Pressable
            style={styles.addButton}
            onPress={onAdd}
          >
            <Ionicons
              name="add"
              size={22}
              color="#FFFFFF"
            />
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
  },

  image: {
    width: 110,
    height: 110,
  },

  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  description: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF5A5F",
  },

  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
  },
});