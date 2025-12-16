import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import RootNavigator from "./src/navigation";
import { View, ActivityIndicator } from "react-native";

import { UserProvider } from "./src/context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}
