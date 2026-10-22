import { ScaledSheet, moderateScale } from "react-native-size-matters";

export const COLORS = {
  primary: "#ff6a8b",
  background: "#ffffff",
  textDark: "#111",
  textLight: "#666",
  badge: "rgba(0,0,0,0.6)",
};

export const G = {
  ms: moderateScale,  // moderate scaler for padding/margin
};

export const globalStyles = ScaledSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  heading: {
    fontSize: "18@ms",
    fontWeight: "700",
    color: COLORS.textDark,
  },

  smallText: {
    fontSize: "14@ms",
    color: COLORS.textLight,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "12@ms",
    elevation: 3,
  },
});
