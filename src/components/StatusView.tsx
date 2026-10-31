import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

// One component, three possible "shapes" of props
type Props =
  | { type: "loading" }
  | { type: "error"; message: string; onRetry: () => void }
  | { type: "empty"; icon?: IconName; title: string; message?: string };

export default function StatusView(props: Props) {
  if (props.type === "loading") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  if (props.type === "error") {
    return (
      <View style={styles.container}>
        <Ionicons name="cloud-offline-outline" size={48} color="#BBBBBB" />
        <Text style={styles.title}>Couldn't load this</Text>
        <Text style={styles.message}>{props.message}</Text>
        <Pressable style={styles.button} onPress={props.onRetry}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name={props.icon ?? "search-outline"} size={48} color="#BBBBBB" />
      <Text style={styles.title}>{props.title}</Text>
      {props.message ? <Text style={styles.message}>{props.message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 },
  title: { fontSize: 18, fontWeight: "700", color: "#222222", marginTop: 12, textAlign: "center" },
  message: { fontSize: 15, color: "#777777", marginTop: 6, textAlign: "center" },
  button: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});