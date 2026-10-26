import { Text, StyleSheet } from "react-native";

type Props = {
    title : string;
}

export default function SectionTitle({
  title,
}: Props) {
  return (
    <Text style={styles.title}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#222",
  },
});