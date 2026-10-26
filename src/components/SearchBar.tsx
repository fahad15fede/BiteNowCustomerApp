import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({ placeholder, value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#777" style={styles.icon} />

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        autoCorrect={false}
        returnKeyType="search"
      />

      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={10}>
          <Ionicons name="close-circle" size={20} color="#999" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
});