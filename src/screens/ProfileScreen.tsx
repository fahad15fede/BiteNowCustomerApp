import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Avatar from "../components/Avatar";
import { TabParamList } from "../navigation/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectCartCount } from "../store/cartSlice";
import { selectOrders } from "../store/orderSlice";
import { selectUser, logoutUser } from "../store/authSlice";

type Props = BottomTabScreenProps<TabParamList, "ProfileTab">;
type IconName = keyof typeof Ionicons.glyphMap;

type RowProps = {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean; // red style for "Log out"
};

function ProfileRow({ icon, label, value, onPress, danger = false }: RowProps) {
  const color = danger ? "#D93025" : "#FF5A5F";

  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, danger && { color }]}>{label}</Text>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      </View>
      {onPress && !danger ? (
        <Ionicons name="chevron-forward" size={20} color="#BBBBBB" />
      ) : null}
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const cartCount = useAppSelector(selectCartCount);
  const orderCount = useAppSelector(selectOrders).length;

  if (!user) return null; // hooks first, then guard

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Header */}
      <View style={styles.header}>
        <Avatar name={user.name} imageUrl={user.profilePicture} size={88} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.subtitle}>BiteNow {user.role}</Text>
      </View>

      {/* 2. Contact details */}
      <Text style={styles.sectionTitle}>Contact details</Text>
      <View style={styles.card}>
        <ProfileRow icon="mail-outline" label="Email" value={user.email} />
        <ProfileRow icon="call-outline" label="Phone" value={user.phone} />
      </View>

      {/* 3. Shortcuts */}
      <Text style={styles.sectionTitle}>Shortcuts</Text>
      <View style={styles.card}>
        <ProfileRow
          icon="cart-outline"
          label="My cart"
          value={`${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          onPress={() => navigation.navigate("CartTab")}
        />
        <ProfileRow
          icon="receipt-outline"
          label="My orders"
          value={`${orderCount} ${orderCount === 1 ? "order" : "orders"}`}
          onPress={() => navigation.navigate("OrderTab")}
        />
        <ProfileRow
          icon="restaurant-outline"
          label="Browse restaurants"
          onPress={() => navigation.navigate("HomeTab")}
        />
      </View>

      {/* 4. Account */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.card}>
        <ProfileRow
          icon="log-out-outline"
          label="Log out"
          danger
          onPress={() => dispatch(logoutUser())}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 28,
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "700", color: "#222222", marginTop: 14 },
  subtitle: { fontSize: 14, color: "#777777", marginTop: 4, textTransform: "capitalize" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777777",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  rowIconDanger: { backgroundColor: "#FDECEA" },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: "600", color: "#222222" },
  rowValue: { fontSize: 14, color: "#777777", marginTop: 2 },
});