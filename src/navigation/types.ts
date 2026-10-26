import { NavigatorScreenParams } from "@react-navigation/native";
import { Restaurant } from "../types";

// ─────────────────────────────────────────────
// 1. BOTTOM TABS: the 3 buttons at the bottom
// ─────────────────────────────────────────────
export type TabParamList = {
  HomeTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
  OrderTab: undefined;
};

// ─────────────────────────────────────────────
// 2. SIDE DRAWER: the slide-in menu. It holds the tabs inside it.
// ─────────────────────────────────────────────
export type DrawerParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
};

// ─────────────────────────────────────────────
// 3. ROOT STACK: the outer pile of pages
//    - Main = the drawer (which has the tabs inside)
//    - Restaurant and Checkout open on top, full screen
// ─────────────────────────────────────────────
export type RootStackParamList = {

  Login: undefined;
  Register: undefined;

  Main: NavigatorScreenParams<DrawerParamList>;
  Restaurant: { restaurant: Restaurant };
  Checkout: undefined;
};