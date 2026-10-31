import { Image, View, StyleSheet, StyleProp, ImageStyle, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type Props = {
  uri: string | null;
  style: StyleProp<ImageStyle>;
  icon?: IconName;
};

/** A photo, or a grey placeholder with an icon when there's no image. */
export default function FoodImage({ uri, style, icon = "fast-food-outline" }: Props) {
  if (uri) {
    return <Image source={{ uri }} style={style} />;
  }

  return (
    <View style={[style as StyleProp<ViewStyle>, styles.placeholder]}>
      <Ionicons name={icon} size={32} color="#CCCCCC" />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
  },
});