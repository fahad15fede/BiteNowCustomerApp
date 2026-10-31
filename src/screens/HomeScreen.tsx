import { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/types";

import HomeHeader from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import SectionTitle from "../components/SectionTitle";
import RestaurantCard from "../components/RestaurantCard";
import StatusView from "../components/StatusView";

import { categories } from "../data/categories";
import { getRestaurants } from "../services/restaurantService";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/authSlice";

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<RootNavigation>();
  const user = useAppSelector(selectUser);

  // 1. What the user typed / tapped
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 2. Typed text wins; otherwise the chip is the search. Wait for typing to pause.
  const query = useDebounce(search.trim() || selectedCategory || "", 400);

  // 3. Ask the SERVER (again whenever `query` changes)
  const { data: restaurants, loading, error, refetch } = useFetch(
    () => getRestaurants(query),
    [query]
  );

  // Pull-to-refresh spinner: on while pulling, off when loading finishes
  const [pulling, setPulling] = useState(false);
  useEffect(() => {
    if (!loading) setPulling(false);
  }, [loading]);

  const onRefresh = () => {
    setPulling(true);
    refetch();
  };

  // Typing clears the chip, so it's always clear what's being searched
  const onChangeSearch = (text: string) => {
    setSearch(text);
    if (selectedCategory) setSelectedCategory(null);
  };

  // Tap a chip → select it (and clear typed text). Tap again → unselect.
  const toggleCategory = (name: string) => {
    setSearch("");
    setSelectedCategory((current) => (current === name ? null : name));
  };

  const listTitle = selectedCategory
    ? `${selectedCategory} places`
    : search.trim()
    ? "Search results"
    : "Popular Restaurants";

  // 4. What to show when the list is empty: loading, error, or "nothing found"
  const renderEmpty = () => {
    if (loading) return <StatusView type="loading" />;
    if (error) return <StatusView type="error" message={error} onRetry={refetch} />;
    return (
      <StatusView
        type="empty"
        title="No restaurants found"
        message="Try another search or category."
      />
    );
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={restaurants ?? []}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={pulling} onRefresh={onRefresh} tintColor="#FF5A5F" />
      }
      ListHeaderComponent={
        <View>
          {user ? (
            <HomeHeader user={user} subtitle="What would you like to eat today?" />
          ) : null}

          <SearchBar
            placeholder="Search restaurants or food..."
            value={search}
            onChangeText={onChangeSearch}
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
        <View style={loading && styles.stale}>
          <RestaurantCard
            restaurant={item}
            onPress={() => navigation.navigate("Restaurant", { restaurant: item })}
          />
        </View>
      )}
      ListEmptyComponent={renderEmpty}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30 },
  stale: { opacity: 0.5 }, // old results fade while new ones load
});