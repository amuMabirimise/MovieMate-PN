import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.push("/popular")}>
        <Text style={styles.navItem}>Popular</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/action")}>
        <Text style={styles.navItem}>Action</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/horror")}>
        <Text style={styles.navItem}>Horror</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/comedy")}>
        <Text style={styles.navItem}>Comedy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#FF4500",
  },
  navItem: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
