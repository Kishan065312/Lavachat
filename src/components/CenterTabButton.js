import React from "react";
import { TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { globalStyles } from "../styles/globalStyles";

export default function CenterTabButton({ children, onPress }) {
  return (
    <TouchableOpacity style={globalStyles.centerTabButton} onPress={onPress}>
      <LinearGradient
        colors={["#ff3cac", "#784ba0", "#2b86c5"]}
        style={globalStyles.centerTabInner}
      >
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}
