import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";

import {restaurants} from "../data/restaurants";
import RestaurantCard from "../components/RestaurantCard";


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        BiteNow 🍔</Text>
      <Text style={styles.subtitle}>
        What would you like to eat today?
      </Text>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E84C3D",
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});