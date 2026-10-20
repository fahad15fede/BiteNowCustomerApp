import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";

import RestaurantScreen from "../screens/RestaurantScreen";

import { RootStackParamList } from "./types";

const Stack =
createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(){

return(

<NavigationContainer>

<Stack.Navigator>

<Stack.Screen

name="Home"

component={HomeScreen}

/>

<Stack.Screen

name="Restaurant"

component={RestaurantScreen}

/>

</Stack.Navigator>

</NavigationContainer>

);

}