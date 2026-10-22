import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
  ScrollView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Pencil, Camera, Armchair, Tag, Crown } from "lucide-react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from "react-redux";
import { createRoom } from "../store/slices/roomSlice";
import { colors } from "../styles/globalStyles";

export default function CreateRoomScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, currentRoom } = useSelector((state) => state.room);
  const { userId } = useSelector((state) => state.auth);
  const [roomName, setRoomName] = useState("");
  const [category, setCategory] = useState("");
  const [maxSeats, setMaxSeats] = useState("15");
  const [enableSuperSeat, setEnableSuperSeat] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCreate = async () => {
    if (!roomName ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const roomData = {
      title: roomName,
      // category: category,
      // maxSeats: parseInt(maxSeats),
      // enableSuperSeat: enableSuperSeat,
      image: selectedImage ? {
        base64Contents: selectedImage.base64,
        fileName: selectedImage.fileName || `room_cover_${Date.now()}.jpg`
      } : null,
      createdBy: userId || 1006
    };

    try {
      const resultAction = await dispatch(createRoom(roomData));
      if (createRoom.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Room Created Successfully!");
        // Navigate to ChatScreen with room data
        navigation.navigate('MainTabs', {
          roomData: resultAction.payload
        });
      } else {
        const errorMsg = typeof resultAction.payload === 'string'
          ? resultAction.payload
          : (resultAction.payload?.message || JSON.stringify(resultAction.payload) || "Failed to create room");
        Alert.alert("Error", errorMsg);
      }
    } catch (err) {
      console.error("Create Room Error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        includeBase64: true,
        selectionLimit: 1,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert("Error", result.errorMessage);
        return;
      }

      const asset = result.assets[0];
      if (asset) {
        setSelectedImage(asset);
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.card, colors.background]} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 26, color: "#fff" }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Room</Text>
          <View style={{ width: 20 }} />
        </View>

        {/* ROOM COVER */}
        <View style={styles.centerContent}>
          <View style={styles.avatarWrapper}>
            <Image
              source={selectedImage ? { uri: selectedImage.uri } : require("../assets/av1.jpg")}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
              <Camera size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.chooseCover}>Choose Room Cover</Text>
        </View>

        {/* INPUTS CONTAINER */}
        <View style={{ marginTop: 30, gap: 20 }}>

          {/* Room Name */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Room Name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.input}
              value={roomName}
              onChangeText={setRoomName}
            />
            <Pencil color={colors.text} size={20} style={{ marginRight: 10 }} />
          </View>

          {/* Category */}
          {/* <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Category (e.g. Business)"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.input}
              value={category}
              onChangeText={setCategory}
            />
            <Tag color="#fff" size={20} style={{ marginRight: 10 }} />
          </View> */}

          {/* Max Seats */}
          {/* <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Max Seats (e.g. 15)"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.input}
              value={maxSeats}
              onChangeText={setMaxSeats}
              keyboardType="numeric"
            />
            <Armchair color="#fff" size={20} style={{ marginRight: 10 }} />
          </View> */}

          {/* Super Seat Toggle */}
          {/* <View style={styles.switchRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Crown color="#D8B4F8" size={24} />
              <Text style={styles.labelSwitch}>Enable Super Seat</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#D8B4F8" }}
              thumbColor={enableSuperSeat ? "#fff" : "#f4f3f4"}
              onValueChange={setEnableSuperSeat}
              value={enableSuperSeat}
            />
          </View> */}

        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={{ marginTop: 50 }}
          onPress={handleCreate}
          disabled={loading}
        >
          <LinearGradient
            colors={[colors.gradMainStart, colors.gradMainEnd]} 
            style={styles.createButton}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Room</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },

  /* CENTER AVATAR */
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary, 
  },
  avatar: {
    width: 126,
    height: 126,
    borderRadius: 63,
  },
  cameraButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: colors.primary, 
    width: 38,
    height: 38,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.text,
  },
  chooseCover: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textDim, 
    fontWeight: "500",
  },

  /* INPUT FIELD */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card, 
    borderRadius: 30,
    height: 55,
    paddingLeft: 20,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text, 
  },

  /* SWITCH ROW */
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  labelSwitch: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  /* CREATE BUTTON */
  createButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
});
