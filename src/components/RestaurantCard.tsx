import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Restaurant } from "../types";

type Props = {
  restaurant: Restaurant;
  onPress?: () => void;
};

export default function RestaurantCard({
  restaurant,
  onPress,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>

        <Image
            source={{ uri: restaurant.image }}
            style={styles.image}
        />

        <View style={styles.content}>

            <View style={styles.header}>

                <Text style={styles.title}>
                    {restaurant.name}
                </Text>

                <Text style={styles.rating}>
                    ⭐ {restaurant.rating}
                </Text>

            </View>

            <Text style={styles.cuisine}>
                {restaurant.cuisine}
            </Text>

            <View style={styles.footer}>

                <View style={styles.row}>

                    <Ionicons
                        name="time-outline"
                        size={16}
                        color="#777"
                    />

                    <Text style={styles.info}>
                        {restaurant.deliveryTime}
                    </Text>

                </View>

                <View style={styles.row}>

                    <Ionicons
                        name="bicycle-outline"
                        size={16}
                        color="#777"
                    />

                    <Text style={styles.info}>
                        {restaurant.deliveryFee}
                    </Text>

                </View>

            </View>

        </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({

  title: {
    
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "700",
  },
  image: {
  width: "100%",
  height: 170,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
},

content: {
  padding: 15,
},

header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

footer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 15,
},

row: {
  flexDirection: "row",
  alignItems: "center",
},

info: {
  marginLeft: 5,
  color: "#777",
},

card: {
  backgroundColor: "#FFFFFF",
  borderRadius: 15,
  marginBottom: 20,
  overflow: "hidden",
  elevation: 4,
  padding: 18,
},

rating: {
  fontWeight: "700",
},

cuisine: {
  marginTop: 8,
  color: "#777",
},
});