import { StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const colors = {
  background: "#0B0B0B", // Obsidian Black
  card: "#1C1C1E",       // Dark Graphite
  primary: "#0F8F6F",    // Emerald Green
  secondary: "#7B2CBF",  // Highlight Purple
  tertiary: "#D4AF37",   // VIP Royal Gold
  accent: "#00E676",     // Success Neon Green
  text: "#FFFFFF",       // Main White
  textDim: "#B8B8B8",    // Secondary Silver
  border: "rgba(255,255,255,0.1)",
  
  // Gradients
  gradVIPStart: "#D4AF37",
  gradVIPEnd: "#FFD700",
  gradMainStart: "#0F8F6F",
  gradMainEnd: "#00C896",
  gradPremiumStart: "#7B2CBF",
  gradPremiumEnd: "#C77DFF",
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerItem: {
    fontSize: moderateScale(18),
    color: colors.textDim, 
    paddingVertical: verticalScale(12),
  },

  tabWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },

  activeBar: {
    width: 20,
    height: 3,
    backgroundColor: colors.primary, 
    borderRadius: 3,
    marginTop: -9,
    alignSelf: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },

  headerActive: {
    color: colors.text, 
    fontWeight: "700",
  },

  banner: {
    width: Dimensions.get("window").width - 32,
    height: verticalScale(200), // Responsive Height
    resizeMode: "cover",
    borderRadius: 14,
    marginTop: 0,
    borderWidth: 1,
    borderColor: colors.border,
  },

  header: {
    marginTop: verticalScale(45), // Responsive Top Margin
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    marginHorizontal: 4,
  },

  dotActive: {
    width: 18,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary, 
  },

  featureCard: {
    width: scale(100),
    height: verticalScale(70),
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    backgroundColor: colors.card, 
    overflow: "hidden",
    elevation: 5,
    borderWidth: scale(1),
    borderColor: "rgba(123, 44, 191, 0.3)", // Subtle Highlight Purple Border
    marginBottom: verticalScale(10),
  },

  featureTop: {
    height: 0,
  },

  featureBody: {
    paddingTop: scale(6),
  },

  featureTitle: {
    fontSize: moderateScale(11),
    fontWeight: "700",
    color: colors.text,
    textAlign: "left",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },

  avatarMini: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(21),
  },

  avatarWrap: {
    position: "relative",
    marginLeft: scale(-12),
  },

  crown: {
    width: scale(22),
    height: scale(22),
    position: "absolute",
    top: scale(-10),
    left: scale(8),
  },

  pillBase: {
    height: verticalScale(38),
    minWidth: scale(95),
    borderRadius: moderateScale(20),
    marginRight: scale(12),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: colors.card, 
    borderWidth: 1,
    borderColor: colors.border,
  },

  pillInactive: {
    backgroundColor: colors.card,
    borderWidth: scale(1),
    borderColor: colors.border,
  },

  pillInactiveText: {
    color: colors.textDim,
    fontSize: moderateScale(14),
    fontWeight: "500",
  },

  pillActive: {
    padding: 0,
    borderWidth: 0,
  },

  pillGradient: {
    height: "100%",
    width: "100%",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  pillActiveText: {
    color: colors.text,
    fontSize: moderateScale(14),
    fontWeight: "700",
  },

  gridCard: {
    width: (Dimensions.get("window").width - scale(16 * 2) - scale(12)) / 2,
    backgroundColor: colors.card, 
    borderRadius: moderateScale(12),
    overflow: "hidden",
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },

  gridImage: {
    width: "100%",
    height: verticalScale(110),
    resizeMode: "cover",
  },

  gridBadge: {
    position: "absolute",
    top: verticalScale(8),
    right: scale(8),
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  badgeText: {
    color: colors.secondary, // Highlight Purple
    fontWeight: "700",
    fontSize: 10,
  },

  gridFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(8),
    gap: scale(8),
  },

  flag: {
    width: scale(18),
    height: verticalScale(12),
    resizeMode: "contain",
    marginRight: scale(6),
  },

  gridTitle: {
    fontSize: moderateScale(14),
    fontWeight: "700",
    flex: 1,
    color: colors.text, 
  },

  bottomNav: {
    position: "absolute",
    left: scale(16),
    right: scale(16),
    bottom: verticalScale(18),
    height: verticalScale(64),
    backgroundColor: colors.background, // Match Background
    borderRadius: moderateScale(36),
    elevation: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: scale(10),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },

  tabBtn: {
    width: scale(40),
    height: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },

  centerBtn: {
    bottom: verticalScale(18),
    alignItems: "center",
    justifyContent: "center",
  },

  centerInner: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: colors.primary, 
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },

  centerTabButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 10,
  },
  centerTabGradient: {
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: colors.accent, // Success Neon Green
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgeText1: {
    color: "#000", // Dark text for neon green badge
    fontSize: 10,
    fontWeight: "bold",
  },
  bigCard: {
    width: "48%",
    height: 110,
    borderRadius: 16,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  bigCardLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },

  whiteCard: {
    backgroundColor: colors.card, 
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.4,
    borderColor: colors.border,
  },

  listText: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },

  tagBox: {
    backgroundColor: "rgba(123, 44, 191, 0.4)", // Muted Purple
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
