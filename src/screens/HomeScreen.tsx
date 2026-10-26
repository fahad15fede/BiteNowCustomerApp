import { useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";                       // 🆕
import { NativeStackNavigationProp } from "@react-navigation/native-stack";     // 🆕

import { RootStackParamList } from "../navigation/types";

import HomeHeader from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import SectionTitle from "../components/SectionTitle";
import RestaurantCard from "../components/RestaurantCard";

import { categories } from "../data/categories";
import { restaurants } from "../data/restaurants";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/authSlice";
import { filterRestaurants } from "../utils/filterRestaurants";

// 🆕 HomeScreen is a TAB, but it opens a page in the ROOT STACK (Restaurant).
//    So we type its navigation as the root stack's navigation.
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {                                          
  const navigation = useNavigation<RootNavigation>();                          
  const user = useAppSelector(selectUser);

  // 1. What the user typed and which chip is selected (null = none)
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 2. Work out the visible list (only recalculated when search/category changes)
  const visibleRestaurants = useMemo(
    () => filterRestaurants(restaurants, search, selectedCategory),
    [search, selectedCategory]
  );

  // Tap a chip → select it. Tap the same chip again → unselect it.
  const toggleCategory = (name: string) => {
    setSelectedCategory((current) => (current === name ? null : name));
  };

  const listTitle = selectedCategory
    ? `${selectedCategory} places`
    : search.trim()
    ? "Search results"
    : "Popular Restaurants";

  // 3. One list for the whole page; everything above the cards is the header
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={visibleRestaurants}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View>
          {user ? (
              <HomeHeader user={user} subtitle="What would you like to eat today?" />
            ) : null}

          <SearchBar
            placeholder="Search restaurants or food..."
            value={search}
            onChangeText={setSearch}
          />

          <SectionTitle title="Categories" />

          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 25 }}
            renderItem={({ item }) => (
              <CategoryChip
                icon={item.icon}
                name={item.name}
                selected={selectedCategory === item.name}
                onPress={() => toggleCategory(item.name)}
              />
            )}
          />

          <SectionTitle title={listTitle} />
        </View>
      }
      renderItem={({ item }) => (
        <RestaurantCard
          restaurant={item}
          onPress={() => navigation.navigate("Restaurant", { restaurant: item })}
        />
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No restaurants found</Text>
          <Text style={styles.emptyText}>Try another search or category.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,   // 🆕 smaller: the tab bar now takes care of the bottom space
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#777",
    marginTop: 6,
  },
});