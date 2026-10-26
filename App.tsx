import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/store/store";

export default function App() {
  return (
    // 1. Lets swipes and drags work (the drawer's swipe-to-open needs this)
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 2. Measures the notch and home bar for every screen */}
      <SafeAreaProvider>
        {/* 3. Gives every screen access to the Redux store (the cart) */}
        <Provider store={store}>
          {/* 4. All the pages and navigators */}
          <AppNavigator />
          <StatusBar style="dark" />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}