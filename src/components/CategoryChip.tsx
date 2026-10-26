import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  icon: string;
  name: string;
  selected?: boolean;
  onPress?: () => void;
};

export default function CategoryChip({ icon, name, selected = false, onPress }: Props) {
  return (
    <Pressable
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.text, selected && styles.selectedText]}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: "center",
    marginRight: 12,
    minWidth: 90,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedContainer: {
    backgroundColor: "#FFF0F0",
    borderColor: "#FF5A5F",
  },
  icon: {
    fontSize: 28,
  },
  text: {
    marginTop: 6,
    fontWeight: "600",
    color: "#222",
  },
  selectedText: {
    color: "#FF5A5F",
  },
});