import { createDrawerNavigator } from "@react-navigation/drawer";

import TabNavigator from "./TabNavigator";
import DrawerContent from "../components/DrawerContent";
import { DrawerParamList } from "./types";

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      // Use OUR menu design (File 3) instead of the default list
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,        // the tabs already show a header with ☰
        drawerType: "front",       // the menu slides OVER the page
        drawerStyle: { width: 280 },
        overlayColor: "rgba(0, 0, 0, 0.4)", // darkens the page behind the menu
        swipeEdgeWidth: 50,        // swipe from the left edge to open
      }}
    >
      {/* The drawer's only page: the whole tab bar */}
      <Drawer.Screen name="Tabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}