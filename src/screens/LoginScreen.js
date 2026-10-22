import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Chrome, Facebook, User, X } from 'lucide-react-native';
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import axios from "axios";
import { BASE_URL } from "../config";
import { useDispatch } from 'react-redux';
import { setUserId } from '../store/slices/authSlice';
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { colors } from "../styles/globalStyles";

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [customFbId, setCustomFbId] = useState("");
  const dispatch = useDispatch();

  // FACEBOOK LOGIN FUNCTION
  const handleFacebookLogin = async () => {
    console.log("==== FACEBOOK LOGIN STARTED ====");

    try {
      console.log("Step 1: Opening Facebook Login Popup...");

      // NOTE: 'email' permission removed temporarily for debugging as per previous fix
      const result = await LoginManager.logInWithPermissions([
        "public_profile"
      ]);

      console.log("Facebook Login Result:", result);

      if (result.isCancelled) {
        console.log("Facebook login CANCELLED by user.");
        return;
      }

      // Start loading immediately after successful login return
      setIsLoading(true);

      console.log("Step 2: Getting Facebook Access Token...");

      const data = await AccessToken.getCurrentAccessToken();

      console.log("AccessToken Response:", data);

      const accessToken = data?.accessToken?.toString();
      console.log("Extracted FB Access Token:", accessToken);

      if (!accessToken) {
        console.log("❌ ERROR: No access token received from Facebook!");
        setIsLoading(false);
        return;
      }

      console.log("Step 3: Sending Access Token to Backend API...");

      const response = await axios.post(
        // `${BASE_URL}api/Accounts/facebook-login`,
        // { accessToken }
        `${BASE_URL}api/Accounts/facebook-login`,
        { accessToken }
      );

      console.log("Backend API Response:", response.data);

      // Store userId in Redux
      if (response.data && response.data.userId) {
        console.log("Storing userId in Redux:", response.data.userId);
        dispatch(setUserId(response.data.userId));
      }

      console.log("Step 4: Navigation to MainTabs...");
      navigation.navigate("MainTabs");

      console.log("==== FACEBOOK LOGIN SUCCESSFUL ====");
      // Note: We don't set isLoading(false) here to prevent flicker before unmount

    } catch (err) {
      console.log("❌ FACEBOOK LOGIN ERROR:", err);
      setIsLoading(false);
    }
  };


  const handleStaticLogin = async () => {
    console.log("baseurl", BASE_URL);
    
    if (!customFbId.trim()) {
      Alert.alert("Error", "Please enter a Facebook ID");
      return;
    }
    setIsLoading(true);
    setModalVisible(false); // Close modal during api call

    try {
      console.log("Using Static Login with ID:", customFbId);
      
      const apiUrl = `${BASE_URL}api/Accounts/facebook-login-static`;
      console.log("Full API URL:", apiUrl);
      
      const response = await axios({
        method: 'POST',
        url: apiUrl,
        data: {
          facebookId: customFbId
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      console.log("Static Login Response:", response.data);

      if (response.data && response.data.userId) {
        console.log("✅ Login successful! UserId:", response.data.userId);
        dispatch(setUserId(response.data.userId));
        navigation.navigate("MainTabs");
      } else {
        Alert.alert("Error", "Login failed: No user ID returned");
      }
    } catch (error) {
      console.error("Static Login Error:", error);
      console.error("Error Details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      let errorMessage = "Login Failed";
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please check your internet connection.";
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = "Network error. Cannot reach server at:\n" + BASE_URL;
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status}\n${JSON.stringify(error.response.data)}`;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const openGuestModal = () => setModalVisible(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={[colors.background, colors.card, colors.background]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {/* DECORATIVE BACKGROUND ELEMENTS */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        {/* LOADING OVERLAY */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Connecting...</Text>
          </View>
        ) : (
          /* CONTENT */
          <View style={styles.contentContainer}>

            {/* HEADER / LOGO */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/banner_2.png')}
                  style={styles.logo}
                />
              </View>
              {/* <Text style={styles.appName}>ACHO</Text> */}
              {/* <Text style={styles.tagline}>Voice. Connect. Enjoy.</Text> */}
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonContainer}>

              {/* GOOGLE */}
              <TouchableOpacity style={[styles.socialBtn, styles.googleBtn]} activeOpacity={0.8}>
                <View style={styles.iconWrapper}>
                  <Chrome size={24} color="#fff" />
                </View>
                <Text style={styles.socialBtnText}>Continue with Google</Text>
              </TouchableOpacity>

              {/* FACEBOOK */}
              <TouchableOpacity
                style={[styles.socialBtn, styles.fbBtn]}
                activeOpacity={0.8}
                onPress={handleFacebookLogin}
              >
                <View style={styles.iconWrapper}>
                  <Facebook size={24} color="#fff" />
                </View>
                <Text style={styles.socialBtnText}>Continue with Facebook</Text>
              </TouchableOpacity>

              {/* GUEST */}
              <TouchableOpacity
                style={[styles.socialBtn, styles.guestBtn]}
                activeOpacity={0.8}
                onPress={openGuestModal}
              >
                <View style={styles.iconWrapper}>
                  <User size={24} color="#fff" />
                </View>
                <Text style={styles.socialBtnText}>Continue as Guest</Text>
              </TouchableOpacity>

            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>By continuing, you agree to our</Text>
              <View style={styles.linksRow}>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}> & </Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        )}
      </LinearGradient>

      {/* GUEST LOGIN MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Guest Login</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#fff" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Enter Facebook ID (Static)</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Ex: 100007592593634"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={customFbId}
              onChangeText={setCustomFbId}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleStaticLogin}
            >
              <Text style={styles.modalBtnText}>Login</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingBottom: verticalScale(60),
    paddingHorizontal: scale(24),
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loadingText: {
    color: colors.text,
    marginTop: verticalScale(20),
    fontSize: moderateScale(18),
    fontWeight: '600',
  },

  // DECORATIVE CIRCLES
  circle1: {
    position: 'absolute',
    top: scale(-50),
    left: scale(-50),
    width: scale(200),
    height: scale(200),
    borderRadius: scale(100),
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    zIndex: 1,
  },
  circle2: {
    position: 'absolute',
    bottom: verticalScale(100),
    right: scale(-30),
    width: scale(150),
    height: scale(150),
    borderRadius: scale(75),
    backgroundColor: 'rgba(106, 13, 173, 0.2)',
    zIndex: 1,
  },

  // HEADER
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(30), // Reduced gap below logo
  },
  logoContainer: {
    // marginBottom: verticalScale(10),
  },
  logo: {
    width: scale(280),
    height: verticalScale(120),
    resizeMode: 'contain',
  },
  appName: {
    fontSize: moderateScale(42),
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 0, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: scale(20),
  },
  tagline: {
    fontSize: moderateScale(16),
    color: colors.primary, 
    marginTop: verticalScale(5),
    letterSpacing: 0.5,
    fontWeight: '500',
  },

  // BUTTONS
  buttonContainer: {
    width: '100%',
    gap: verticalScale(16),
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(56),
    borderRadius: moderateScale(28),
    paddingHorizontal: scale(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconWrapper: {
    width: scale(30),
    alignItems: 'center',
  },
  socialBtnText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginRight: scale(30), // Balance the icon width
  },

  // SPECIFIC BUTTON STYLES
  googleBtn: {
    backgroundColor: 'rgba(219, 68, 55, 0.8)', // Google Red with opacity
  },
  fbBtn: {
    backgroundColor: '#1877F2', // Facebook Blue
  },
  guestBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glass effect
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // FOOTER
  footer: {
    position: 'absolute',
    bottom: verticalScale(30),
    alignItems: 'center',
    alignSelf: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: moderateScale(12),
  },
  linksRow: {
    flexDirection: 'row',
    marginTop: verticalScale(5),
  },
  linkText: {
    color: colors.primary,
    fontSize: moderateScale(12),
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalLabel: {
    color: '#ccc',
    marginBottom: 8,
    fontSize: 14,
  },
  modalInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  modalBtn: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
