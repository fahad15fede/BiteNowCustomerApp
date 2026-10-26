import { View, Text, Image, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation, CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList, TabParamList } from "../navigation/types";
import { CartItem } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addItem,
  removeItem,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from "../store/cartSlice";

// ─────────────────────────────────────────────
// Navigation type: Cart is a TAB, but it also opens Checkout (a ROOT STACK page).
// CompositeNavigationProp combines both remote controls into one.
// ─────────────────────────────────────────────
type CartNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "CartTab">,   // can go to other tabs
  NativeStackNavigationProp<RootStackParamList>       // can open root stack pages
>;

// ─────────────────────────────────────────────
// One row in the cart: image · name · price · [− 2 +] · line total
// ─────────────────────────────────────────────
type RowProps = {
  cartItem: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
};

function CartItemRow({ cartItem, onIncrease, onDecrease }: RowProps) {
  const { item, quantity } = cartItem;

  return (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.rowInfo}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.unitPrice}>${item.price.toFixed(2)} each</Text>

        {/* − quantity + */}
        <View style={styles.stepper}>
          <Pressable style={styles.stepButton} onPress={onDecrease} hitSlop={6}>
            <Ionicons
              name={quantity === 1 ? "trash-outline" : "remove"}
              size={18}
              color="#FF5A5F"
            />
          </Pressable>
          <Text style={styles.qty}>{quantity}</Text>
          <Pressable style={styles.stepButton} onPress={onIncrease} hitSlop={6}>
            <Ionicons name="add" size={18} color="#FF5A5F" />
          </Pressable>
        </View>
      </View>

      <Text style={styles.lineTotal}>${(item.price * quantity).toFixed(2)}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// The page
// ─────────────────────────────────────────────
export default function CartScreen() {
  const navigation = useNavigation<CartNavigation>();
  const dispatch = useAppDispatch();

  // READ from the store
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartTotal);

  // WORK OUT the rest from what we read (no need to store these)
  const deliveryFee: number = 0; // all restaurants are "Free Delivery" for now
  const total = subtotal + deliveryFee;

  // 1. Empty cart → friendly message + a way back to food
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyCircle}>
          <Ionicons name="cart-outline" size={56} color="#FF5A5F" />
        </View>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Looks like you haven&apos;t added anything yet.
        </Text>
        <Pressable style={styles.browseButton} onPress={() => navigation.navigate("HomeTab")}>
          <Text style={styles.browseButtonText}>Browse restaurants</Text>
        </Pressable>
      </View>
    );
  }

  // 2. Cart with items → list + bill + checkout bar
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(cartItem) => cartItem.item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.heading}>
            {count} {count === 1 ? "item" : "items"} in your cart
          </Text>
        }
        renderItem={({ item: cartItem }) => (
          <CartItemRow
            cartItem={cartItem}
            onIncrease={() => dispatch(addItem(cartItem.item))}
            onDecrease={() => dispatch(removeItem(cartItem.item.id))}
          />
        )}
        ListFooterComponent={
          <View style={styles.billCard}>
            <Text style={styles.billTitle}>Bill summary</Text>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery fee</Text>
              <Text style={[styles.billValue, styles.free]}>
                {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.billRow}>
              <Text style={styles.billTotalLabel}>Total</Text>
              <Text style={styles.billTotalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        }
      />

      {/* 3. Checkout bar: NOT absolute, it just sits under the list */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomTotal}>${total.toFixed(2)}</Text>
        </View>
        <Pressable style={styles.checkoutButton} onPress={() => navigation.navigate("Checkout")}>
          <Text style={styles.checkoutText}>Checkout</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Page
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

  // One cart row
  row: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  rowInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
  },
  unitPrice: {
    fontSize: 13,
    color: "#777777",
    marginTop: 2,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFF0F0",
    borderRadius: 18,
    marginTop: 8,
  },
  stepButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  qty: {
    minWidth: 20,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
  },
  lineTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
    marginLeft: 8,
  },

  // Bill summary
  billCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  billTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 12,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  billLabel: {
    fontSize: 15,
    color: "#777777",
  },
  billValue: {
    fontSize: 15,
    color: "#222222",
  },
  free: {
    color: "#2E9E5B",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 8,
  },
  billTotalLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
  },
  billTotalValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
  },

  // Bottom checkout bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  bottomLabel: {
    fontSize: 13,
    color: "#777777",
  },
  bottomTotal: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222222",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5A5F",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
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
});