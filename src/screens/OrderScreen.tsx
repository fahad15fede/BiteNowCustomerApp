import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { TabParamList } from "../navigation/types";
import { Order } from "../types";
import { useAppSelector } from "../store/hooks";
import { selectOrders } from "../store/orderSlice";

// Orders is a TAB → tab screen props (like ProfileScreen)
type Props = BottomTabScreenProps<TabParamList, "OrderTab">;

type OrderProps = {
  order: Order;
};

function OrderCard({ order }: OrderProps) {
  const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const date = new Date(order.createdAt).toLocaleString();
  const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
  const itemNames = order.items
    .map((c) => `${c.quantity} x ${c.item.name}`)
    .join(", ");

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.orderNumber}>{order.id}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={styles.date}>{date}</Text>

      <Text style={styles.itemNames} numberOfLines={2}>
        {itemNames}
      </Text>

      <View style={styles.divider} />

      <View style={styles.rowBetween}>
        <Text style={styles.count}>
          {count} {count === 1 ? "item" : "items"}
        </Text>
        <Text style={styles.total}>${order.total.toFixed(2)}</Text>
      </View>
    </View>
  );
}

export default function OrdersScreen({ navigation }: Props) {
  const orders = useAppSelector(selectOrders);

  if (orders.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyCircle}>
          <Ionicons name="receipt-outline" size={56} color="#FF5A5F" />
        </View>
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptyText}>
          When you place an order, it will show up here.
        </Text>
        <Pressable style={styles.browseButton} onPress={() => navigation.navigate("HomeTab")}>
          <Text style={styles.browseButtonText}>Browse restaurants</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={orders}
      keyExtractor={(order) => order.id}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text style={styles.heading}>
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </Text>
      }
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
  },
  statusBadge: {
    backgroundColor: "#FFF4E5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E08A00",
  },
  date: {
    fontSize: 13,
    color: "#999999",
    marginTop: 4,
  },
  itemNames: {
    fontSize: 14,
    color: "#555555",
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 12,
  },
  count: {
    fontSize: 14,
    color: "#777777",
  },
  total: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  listContent: {
    padding: 20,
  },
  heading: {
    fontSize: 15,
    color: "#777777",
    marginBottom: 12,
  },

  // Empty state
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  emptyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222222",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 15,
    color: "#777777",
    textAlign: "center",
    marginTop: 8,
  },
  browseButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginTop: 28,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
})