import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import LinearGradient from "react-native-linear-gradient";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import EventScreen from "../screens/EventScreen";
import MomentScreen from "../screens/MomentScreen";
import LoginScreen from "../screens/LoginScreen";
import CreateRoomScreen from "../screens/CreateRoomScreen";
import ChatScreen from "../screens/ChatScreen";
import MessageListScreen from "../screens/MessageListScreen";
import DirectChatScreen from "../screens/DirectChatScreen";
import UserProfileDetailScreen from "../screens/UserProfileDetailScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import SearchScreen from "../screens/SearchScreen";
import SVIPScreen from "../screens/SVIPScreen";
import VIPScreen from "../screens/VIPScreen";
import GameLevelScreen from "../screens/GameLevelScreen";
import RewardRecordScreen from "../screens/RewardRecordScreen";
import GameLevelRulesScreen from "../screens/GameLevelRulesScreen";
import GameLevelRankingsScreen from "../screens/GameLevelRankingsScreen";
import LevelScreen from "../screens/LevelScreen";
import FamilySquareScreen from "../screens/FamilySquareScreen";
import InfluenceScreen from "../screens/InfluenceScreen";
import CPSpaceScreen from "../screens/CPSpaceScreen";
import CPDetailsScreen from "../screens/CPDetailsScreen";
import MedalAndTitleScreen from "../screens/MedalAndTitleScreen";
import StoreScreen from "../screens/StoreScreen";
import BackpackScreen from "../screens/BackpackScreen";
import InviteFriendScreen from "../screens/InviteFriendScreen";
import MysteryScreen from "../screens/MysteryScreen";
import MysteryDescriptionScreen from "../screens/MysteryDescriptionScreen";
import MysteryTrialCardScreen from "../screens/MysteryTrialCardScreen";
import AccountScreen from "../screens/AccountScreen";
import SettingScreen from "../screens/SettingScreen";
import FollowUsScreen from "../screens/FollowUsScreen";
import CustomerServiceScreen from "../screens/CustomerServiceScreen";
import AppLanguageScreen from "../screens/AppLanguageScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ResourceDownloadScreen from "../screens/ResourceDownloadScreen";
import DeleteAccountScreen from "../screens/DeleteAccountScreen";
import AboutScreen from "../screens/AboutScreen";
import CustomerServiceHistoryScreen from "../screens/CustomerServiceHistoryScreen";
import CoinScreen from "../screens/CoinScreen";
import TransferCoinsScreen from "../screens/TransferCoinsScreen";
import { Home, Gamepad2, Compass, MessageCircle, User , Flower2 } from "lucide-react-native";
import { colors } from "../styles/globalStyles";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CenterTabButton({ children, onPress }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <LinearGradient
        colors={[colors.gradMainStart, colors.gradMainEnd]}
        style={{
          width: 75,
          height: 75,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderColor: colors.border,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={22} color={color} />
        }}
      />
      <Tab.Screen
        name="Event"
        component={EventScreen}
        options={{
          tabBarIcon: ({ color }) => <Gamepad2 size={22} color={color} />
        }}
      />
      <Tab.Screen
        name="Mint"
        component={MomentScreen}
        options={{
          tabBarIcon: ({ color }) => <Flower2 size={22} color={color} />
        }}
      />
      <Tab.Screen
        name="Message"
        component={MessageListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <MessageCircle size={22} color={color} />
              <View
                style={{
                  position: "absolute",
                  right: -6,
                  top: -4,
                  backgroundColor: '#FF3B30',
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                  borderWidth: 1,
                  borderColor: colors.background,
                  zIndex: 10
                }}
              >
                <Text style={{ color: "#fff", fontSize: 9, fontWeight: "bold" }}>21</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <User size={22} color={color} />
              <View
                style={{
                  position: "absolute",
                  right: -2,
                  top: 0,
                  backgroundColor: '#FF3B30',
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: colors.background,
                  zIndex: 10
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import FloatingRoomWidget from "../components/FloatingRoomWidget";

// ... existing code ...

export default function MainNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen name="CreateRoomScreen" component={CreateRoomScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="DirectChatScreen" component={DirectChatScreen} />
        <Stack.Screen name="UserProfileDetailScreen" component={UserProfileDetailScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="SVIPScreen" component={SVIPScreen} />
        <Stack.Screen name="VIPScreen" component={VIPScreen} />
        <Stack.Screen name="GameLevelScreen" component={GameLevelScreen} />
        <Stack.Screen name="RewardRecordScreen" component={RewardRecordScreen} />
        <Stack.Screen name="GameLevelRulesScreen" component={GameLevelRulesScreen} />
        <Stack.Screen name="GameLevelRankingsScreen" component={GameLevelRankingsScreen} />
        <Stack.Screen name="LevelScreen" component={LevelScreen} />
        <Stack.Screen name="InfluenceScreen" component={InfluenceScreen} />
        <Stack.Screen name="CPSpaceScreen" component={CPSpaceScreen} />
        <Stack.Screen name="CPDetailsScreen" component={CPDetailsScreen} />
        <Stack.Screen name="MedalAndTitleScreen" component={MedalAndTitleScreen} />
        <Stack.Screen name="StoreScreen" component={StoreScreen} />
        <Stack.Screen name="BackpackScreen" component={BackpackScreen} />
        <Stack.Screen name="InviteFriendScreen" component={InviteFriendScreen} />
        <Stack.Screen name="MysteryScreen" component={MysteryScreen} />
        <Stack.Screen name="MysteryDescriptionScreen" component={MysteryDescriptionScreen} />
        <Stack.Screen name="MysteryTrialCardScreen" component={MysteryTrialCardScreen} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
        <Stack.Screen name="FollowUsScreen" component={FollowUsScreen} />
        <Stack.Screen name="CustomerServiceScreen" component={CustomerServiceScreen} />
        <Stack.Screen name="AppLanguageScreen" component={AppLanguageScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="ResourceDownloadScreen" component={ResourceDownloadScreen} />
        <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="CustomerServiceHistoryScreen" component={CustomerServiceHistoryScreen} />
        <Stack.Screen name="FamilySquareScreen" component={FamilySquareScreen} />
        <Stack.Screen name="CoinScreen" component={CoinScreen} />
        <Stack.Screen name="TransferCoinsScreen" component={TransferCoinsScreen} />
      </Stack.Navigator>
      <FloatingRoomWidget />
    </View>
  );
}
