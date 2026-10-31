import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, Pressable, RefreshControl, StyleSheet } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { TabParamList } from "../navigation/types";
import { Order, OrderStatus } from "../types";
import { getMyOrders } from "../services/orderService";
import { useFetch } from "../hooks/useFetch";
import { formatPrice } from "../utils/format";
import StatusView from "../components/StatusView";

type Props = BottomTabScreenProps<TabParamList, "OrdersTab">;

// ─────────────────────────────────────────────
// How each status looks: every status MUST have an entry (Record)
// ─────────────────────────────────────────────
const statusStyle: Record<OrderStatus, { label: string; color: string; background: string }> = {
  pending: { label: "Waiting for restaurant", color: "#E08A00", background: "#FFF4E5" },
  accepted: { label: "Accepted", color: "#1A73E8", background: "#E8F0FE" },
  preparing: { label: "Preparing", color: "#1A73E8", background: "#E8F0FE" },
  ready_for_pickup: { label: "Ready for pickup", color: "#7B1FA2", background: "#F3E5F5" },
  picked_up: { label: "On the way", color: "#7B1FA2", background: "#F3E5F5" },
  delivered: { label: "Delivered", color: "#2E9E5B", background: "#E6F4EA" },
  rejected: { label: "Rejected", color: "#D93025", background: "#FDECEA" },
  cancelled: { label: "Cancelled", color: "#777777", background: "#F1F1F1" },
};

// ─────────────────────────────────────────────
// One order card
// ─────────────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const status = statusStyle[order.status];
  const count = order.items.reduce((sum, line) => sum + line.quantity, 0);
  const date = new Date(order.createdAt).toLocaleString();
  const itemNames = order.items
    .map((line) => `${line.quantity} × ${line.nameSnapshot}`)
    .join(", ");

  return (
    <View style={styles.card}>
      {/* Restaurant ...... status */}
      <View style={styles.rowBetween}>
        <Text style={styles.restaurant} numberOfLines={1}>
          {order.restaurant.name}
        </Text>
        <View style={[styles.badge, { backgroundColor: status.background }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <Text style={styles.meta}>
        {order.number} · {date}
      </Text>

      <Text style={styles.itemNames} numberOfLines={2}>
        {itemNames}
      </Text>

      <View style={styles.divider} />

      <View style={styles.rowBetween}>
        <Text style={styles.count}>
          {count} {count === 1 ? "item" : "items"}
        </Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// The page
// ─────────────────────────────────────────────
export default function OrdersScreen({ navigation }: Props) {
  const { data: orders, loading, error, refetch } = useFetch(() => getMyOrders(), []);

  // Reload every time the tab is opened again (e.g. right after placing an order)
  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false; // useFetch already loads on the first open
        return;
      }
      refetch();
    }, [refetch])
  );

  // Pull-to-refresh
  const [pulling, setPulling] = useState(false);
  useEffect(() => {
    if (!loading) setPulling(false);
  }, [loading]);

  const renderEmpty = () => {
    if (loading) return <StatusView type="loading" />;
    if (error) return <StatusView type="error" message={error} onRetry={refetch} />;
    return (
      <View style={styles.empty}>
        <View style={styles.emptyCircle}>
          <Ionicons name="receipt-outline" size={56} color="#FF5A5F" />
        </View>
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptyText}>When you place an order, it will show up here.</Text>
        <Pressable style={styles.browseButton} onPress={() => navigation.navigate("HomeTab")}>
          <Text style={styles.browseButtonText}>Browse restaurants</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={orders ?? []}
      keyExtractor={(order) => order.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={pulling}
          onRefresh={() => {
            setPulling(true);
            refetch();
          }}
          tintColor="#FF5A5F"
        />
      }
      ListHeaderComponent={
        orders && orders.length > 0 ? (
          <Text style={styles.heading}>
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </Text>
        ) : null
      }
      renderItem={({ item }) => <OrderCard order={item} />}
      ListEmptyComponent={renderEmpty}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  listContent: { padding: 20, flexGrow: 1 },
  heading: { fontSize: 15, color: "#777777", marginBottom: 12 },

  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  restaurant: { flex: 1, fontSize: 17, fontWeight: "700", color: "#222222", marginRight: 10 },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  meta: { fontSize: 13, color: "#999999", marginTop: 4 },
  itemNames: { fontSize: 14, color: "#555555", marginTop: 10 },
  divider: { height: 1, backgroundColor: "#EEEEEE", marginVertical: 12 },
  count: { fontSize: 14, color: "#777777" },
  total: { fontSize: 17, fontWeight: "700", color: "#222222" },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: { fontSize: 22, fontWeight: "700", color: "#222222", marginTop: 20 },
  emptyText: { fontSize: 15, color: "#777777", textAlign: "center", marginTop: 8 },
  browseButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginTop: 28,
  },
  browseButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});