import { View, Text, StyleSheet } from "react-native";
import { User } from "../types";

type HomeHeaderProps = {
    subtitle: string;
    user: User;
};

export default function HomeHeader({ user, subtitle }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        👋 Hello, {user.name}
      </Text>

      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },

  greeting: {
    fontSize: 30,
    fontWeight: "700",
    color: "#222",
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
});