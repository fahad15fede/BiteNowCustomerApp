import { View, Text, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { TabParamList } from "../navigation/types";
import { currentUser } from "../data/user";
import { useAppSelector } from "../store/hooks";
import { selectCartCount } from "../store/cartSlice";

// This page lives in the TABS, so it uses the tab version of screen props
type Props = BottomTabScreenProps<TabParamList, "ProfileTab">;

type IconName = keyof typeof Ionicons.glyphMap;

// ─────────────────────────────────────────────
// A small component used only on this page: one row in a list
// ─────────────────────────────────────────────
type RowProps = {
  icon: IconName;
  label: string;
  value?: string;        // optional second line
  onPress?: () => void;  // optional: if given, the row is tappable
};

function ProfileRow({ icon, label, value, onPress }: RowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color="#FF5A5F" />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      </View>

      {/* Arrow only on tappable rows */}
      {onPress ? <Ionicons name="chevron-forward" size={20} color="#BBBBBB" /> : null}
    </Pressable>
  );
}

// ─────────────────────────────────────────────
// The page itself
// ─────────────────────────────────────────────
export default function ProfileScreen({ navigation }: Props) {
  const cartCount = useAppSelector(selectCartCount);

  const initials = currentUser.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Header card */}
      <View style={styles.header}>
        {currentUser.profilePicture ? (
          <Image source={{ uri: currentUser.profilePicture }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.subtitle}>BiteNow member</Text>
      </View>

      {/* 2. Contact details: information only, not tappable */}
      <Text style={styles.sectionTitle}>Contact details</Text>
      <View style={styles.card}>
        <ProfileRow icon="mail-outline" label="Email" value={currentUser.email} />
        <ProfileRow icon="call-outline" label="Phone" value={currentUser.phone} />
      </View>

      {/* 3. Shortcuts: tappable, they switch tabs */}
      <Text style={styles.sectionTitle}>Shortcuts</Text>
      <View style={styles.card}>
        <ProfileRow
          icon="cart-outline"
          label="My cart"
          value={`${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          onPress={() => navigation.navigate("CartTab")}
        />
        <ProfileRow
          icon="restaurant-outline"
          label="Browse restaurants"
          onPress={() => navigation.navigate("HomeTab")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 28,
    marginBottom: 10,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222222",
    marginTop: 14,
  },
  subtitle: {
    fontSize: 14,
    color: "#777777",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#777777",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
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
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
  },
  rowValue: {
    fontSize: 13,
    color: "#777777",
    marginTop: 3,
  },
});