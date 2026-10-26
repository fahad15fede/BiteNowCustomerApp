import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../navigation/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart, selectCartItems, selectCartTotal } from "../store/cartSlice";
import { addOrder } from "../store/orderSlice";
import { Order } from "../types";

// Checkout lives directly in the ROOT STACK → normal stack props
type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

type PaymentMethod = Order["paymentMethod"];
type IconName = React.ComponentProps<typeof Ionicons>["name"];

// The payment choices as DATA (same idea as the drawer links)
const paymentOptions: { id: PaymentMethod; label: string; icon: IconName }[] = [
  { id: "cash", label: "Cash on delivery", icon: "cash-outline" },
  { id: "card", label: "Card", icon: "card-outline" },
];

// What we remember about an order AFTER it's placed
type PlacedOrder = {
  number: string;
  total: number;
  payment: PaymentMethod;
};

export default function CheckoutScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  // From the store (shared)
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);

  // Local to this page
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  // Worked out, not stored
  const deliveryFee: number = 0;
  const total = subtotal + deliveryFee;
  const canPlaceOrder = address.trim().length > 0;

  // Go back to the tabs and land on Home
  const goHome = () => {
    navigation.popTo("Main", {
      screen: "Tabs",
      params: { screen: "HomeTab" },
    });
  };

  const placeOrder = () => {
    const order: Order = {
      id: `BN-${Math.floor(1000 + Math.random() * 9000)}`,
      items,
      total,
      paymentMethod: payment,
      address,
      createdAt: new Date().toISOString(),
      status: "preparing",
    };

    dispatch(addOrder(order));

    setPlacedOrder({
      number: order.id,
      total: order.total,
      payment: order.paymentMethod,
    });

    dispatch(clearCart());
  };

  // ─────────────────────────────────────────────
  // A. Order placed → confirmation page
  // ─────────────────────────────────────────────
  if (placedOrder) {
    return (
      <View style={[styles.center, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={56} color="#FFFFFF" />
        </View>
        <Text style={styles.successTitle}>Order placed!</Text>
        <Text style={styles.muted}>Your food is on the way 🛵</Text>

        <View style={styles.receipt}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Order number</Text>
            <Text style={styles.billValueBold}>{placedOrder.number}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Paid with</Text>
            <Text style={styles.billValue}>
              {placedOrder.payment === "cash" ? "Cash on delivery" : "Card"}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Total</Text>
            <Text style={styles.billValueBold}>${placedOrder.total.toFixed(2)}</Text>
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={goHome}>
          <Text style={styles.primaryButtonText}>Back to home</Text>
        </Pressable>
      </View>
    );
  }

  // ─────────────────────────────────────────────
  // B. Nothing to check out (e.g. the cart was emptied) → guard
  // ─────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.successTitle}>Nothing to check out</Text>
        <Text style={styles.muted}>Your cart is empty.</Text>
        <Pressable style={styles.primaryButton} onPress={goHome}>
          <Text style={styles.primaryButtonText}>Browse restaurants</Text>
        </Pressable>
      </View>
    );
  }

  // ─────────────────────────────────────────────
  // C. The checkout form
  // ─────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Address */}
        <Text style={styles.sectionTitle}>Delivery address</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Ionicons name="location-outline" size={22} color="#FF5A5F" />
            <TextInput
              style={styles.input}
              placeholder="House, street, area"
              placeholderTextColor="#999999"
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>

        {/* 2. Payment */}
        <Text style={styles.sectionTitle}>Payment method</Text>
        <View style={styles.card}>
          {paymentOptions.map((option) => {
            const isSelected = payment === option.id;
            return (
              <Pressable
                key={option.id}
                style={styles.paymentRow}
                onPress={() => setPayment(option.id)}
              >
                <Ionicons name={option.icon} size={22} color="#444444" />
                <Text style={styles.paymentLabel}>{option.label}</Text>
                <Ionicons
                  name={isSelected ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={isSelected ? "#FF5A5F" : "#BBBBBB"}
                />
              </Pressable>
            );
          })}
        </View>

        {/* 3. Order summary */}
        <Text style={styles.sectionTitle}>Order summary</Text>
        <View style={styles.card}>
          {items.map((c) => (
            <View key={c.item.id} style={styles.billRow}>
              <Text style={styles.billLabel}>
                {c.quantity} × {c.item.name}
              </Text>
              <Text style={styles.billValue}>${(c.item.price * c.quantity).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

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
        </View>
      </ScrollView>

      {/* 4. Bottom bar: total + place order (kept above the phone's home bar) */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 14 }]}>
        <View>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomTotal}>${total.toFixed(2)}</Text>
        </View>
        <Pressable
          style={[styles.placeButton, !canPlaceOrder && styles.disabled]}
          disabled={!canPlaceOrder}
          onPress={placeOrder}
        >
          <Text style={styles.placeButtonText}>Place order</Text>
        </Pressable>
      </View>

      {!canPlaceOrder && (
        <Text style={[styles.hint, { bottom: insets.bottom + 84 }]}>
          Add a delivery address to continue
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Page
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777777",
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
  },

  // Address
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 6,
  },

  // Payment
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  paymentLabel: {
    flex: 1,
    fontSize: 16,
    color: "#222222",
    marginLeft: 12,
  },

  // Bill rows (used in summary and receipt)
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  billLabel: {
    fontSize: 15,
    color: "#555555",
    flexShrink: 1,
    marginRight: 10,
  },
  billValue: {
    fontSize: 15,
    color: "#222222",
  },
  billValueBold: {
    fontSize: 15,
    fontWeight: "700",
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

  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 14,
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
  placeButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  placeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.4,
  },
  hint: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#999999",
    fontSize: 13,
  },

  // Success + empty
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#FFFFFF",
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2E9E5B",
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222222",
    marginTop: 18,
  },
  muted: {
    fontSize: 16,
    color: "#777777",
    marginTop: 6,
  },
  receipt: {
    alignSelf: "stretch",
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 16,
    marginTop: 28,
  },
  primaryButton: {
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: "#FF5A5F",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 24,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});