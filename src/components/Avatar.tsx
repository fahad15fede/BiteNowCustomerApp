import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  name: string;
  imageUrl?: string;
  size?: number;
};

// "Muhammad Fahad" → "MF"
const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Avatar({ name, imageUrl, size = 64 }: Props) {
  // The circle's size depends on the "size" prop
  const circle = { width: size, height: size, borderRadius: size / 2 };

  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} style={circle} />;
  }

  return (
    <View style={[styles.fallback, circle]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});