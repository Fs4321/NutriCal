import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import Constants from 'expo-constants';

export function GlobalLayout({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      
      <View style={styles.statusBarBackground} />
      <StatusBar style="dark" translucent={false} backgroundColor="#f4f0db" />
      
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eff4dc",  // matching to main app background
  },
  statusBarBackground: {
    height: Constants.statusBarHeight,
    backgroundColor: "#f4f0db",  // dark shade to highlight status bar
  },
  container: {
    flex: 1,
    backgroundColor: "#fdf9f4",
    width: "90%",
    alignSelf: "center",
  },
});
