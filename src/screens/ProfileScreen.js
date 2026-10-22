import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, Alert } from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from "react-native-linear-gradient";
import { globalStyles, colors } from "../styles/globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../store/slices/authSlice";
import apiService from "../services/apiService";
import { useNavigation } from "@react-navigation/native";

import {
  Medal,
  Crown,
  Store,
  ChevronRight,
  ChevronLeft,
  Users,
  Compass,
  ShoppingBag,
  Heart,
  User,
  Settings,
  Plus,
  MessageCircle,
  X,
  Edit2,
  Copy,
  PlusSquare,
  HelpCircle,
  BookmarkPlus,
  Camera
} from "lucide-react-native";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const profile = useSelector((state) => state.auth.profile);
  const [loading, setLoading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        console.log("No userId found in Redux");
        return;
      }
      try {
        setLoading(true);
        console.log("Fetching profile for userId:", userId);
        const response = await apiService.get(`api/User/${userId}/profile`);
        if (response.success && response.data) {
          dispatch(setProfile(response.data));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, dispatch]);

  const handleBackgroundOptions = () => {
    Alert.alert(
      "Profile Background",
      "Choose an action",
      [
        { text: "Change Photo", onPress: uploadBackground },
        { text: "Remove Photo", onPress: removeBackground, style: "destructive" },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const uploadBackground = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.didCancel || !result.assets || result.assets.length === 0) return;
    
    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('image', {
      uri: asset.uri,
      type: asset.type || 'image/jpeg',
      name: asset.fileName || 'background.jpg'
    });

    try {
      setLoading(true);
      const response = await apiService.post(`api/User/${userId}/profile-background`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.success || response.status) {
        // Re-fetch profile
        const profileRes = await apiService.get(`api/User/${userId}/profile`);
        if (profileRes.success && profileRes.data) {
          dispatch(setProfile(profileRes.data));
        }
      }
    } catch (error) {
      console.error("Upload background error", error);
      Alert.alert("Error", "Failed to upload background.");
    } finally {
      setLoading(false);
    }
  };

  const removeBackground = async () => {
    try {
      setLoading(true);
      const response = await apiService.delete(`api/User/${userId}/profile-background`);
      if (response.success || response.status) {
        // Re-fetch profile
        const profileRes = await apiService.get(`api/User/${userId}/profile`);
        if (profileRes.success && profileRes.data) {
          dispatch(setProfile(profileRes.data));
        }
      }
    } catch (error) {
      console.error("Remove background error", error);
      Alert.alert("Error", "Failed to remove background.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Top Section with Background Image */}
        <ImageBackground 
          source={profile?.backgroundPhotoUrl ? { uri: `https://landing.hostingsky.in${profile.backgroundPhotoUrl}` } : require('../assets/banner_2.png')} 
          style={{ width: '100%', height: 330 }} 
          resizeMode="cover">
          <LinearGradient
            colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
            style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40, paddingBottom: 25, justifyContent: 'space-between' }}
          >
            {/* Top Header Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 30, gap: 10 }}>
              <TouchableOpacity onPress={handleBackgroundOptions} style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 16, padding: 6 }}>
                <Camera color="#fff" size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ProfileEditScreen')} style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 16, padding: 6 }}>
                <Edit2 color="#fff" size={20} />
              </TouchableOpacity>
            </View>

            <View>
              <View style={{ alignItems: 'flex-start' }}>
                {/* Avatar */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfileScreen')}
                  activeOpacity={0.8}
                  style={{ position: 'relative', marginBottom: 12 }}
                >
                  <Image
                    source={
                      profile?.avatarUrl || profile?.profilePictureUrl
                        ? {
                          uri: (profile.avatarUrl || profile.profilePictureUrl).startsWith('http')
                            ? (profile.avatarUrl || profile.profilePictureUrl)
                            : `https://landing.hostingsky.in${profile.avatarUrl || profile.profilePictureUrl}`
                        }
                        : require('../assets/av1.jpg')
                    }
                    style={{ width: 85, height: 85, borderRadius: 42.5 }}
                  />
                </TouchableOpacity>

                {/* Name and Badge */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 0.5 }} numberOfLines={1}>{profile?.displayName || profile?.name || 'Amayra'}</Text>
                  <View style={{ backgroundColor: 'rgba(100, 110, 160, 0.9)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: 'https://img.icons8.com/color/48/diamond.png' }} style={{ width: 10, height: 10, marginRight: 4 }} />
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>2</Text>
                  </View>
                </View>

                {/* ID and Copy */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '500' }}>ID:{profile?.id || '574586401'}</Text>
                  <TouchableOpacity style={{ marginLeft: 6, padding: 2 }}>
                    <Copy color="rgba(100, 110, 160, 0.9)" size={10} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>{profile?.friends || 0}</Text><Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, marginTop: 3, fontWeight: '600' }}>Friends</Text></View>
                  <View style={{ alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>{profile?.following || 0}</Text><Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, marginTop: 3, fontWeight: '600' }}>Following</Text></View>
                  <View style={{ alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>{profile?.followers || 0}</Text><Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, marginTop: 3, fontWeight: '600' }}>Followers</Text></View>
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ position: 'relative' }}>
                      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>{profile?.visitors || 0}</Text>
                      {profile?.visitors > 0 && (
                        <View style={{ position: 'absolute', top: -5, right: -12, backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' }}>
                          <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>{profile?.visitors}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 9, marginTop: 3, fontWeight: '600' }}>Visitors</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('SVIPScreen')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }}>Get SVIP </Text>
                  <ChevronRight color="#fff" size={14} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Menu Sections */}
        <View style={{ padding: 10, gap: 10, marginTop: -20, backgroundColor: '#f4f6f9', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>

          {/* First Card - 4 columns with premium 3D Fluent icons */}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate('VIPScreen')} style={{ alignItems: 'center', flex: 1 }}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/crown.png' }} style={{ width: 30, height: 30 }} />
                <Text style={{ fontSize: 10, marginTop: 2, color: '#4b5563', fontWeight: '600' }}>VIP</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('LevelScreen')} style={{ alignItems: 'center', flex: 1 }}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/store-front.png' }} style={{ width: 30, height: 30 }} />
                <Text style={{ fontSize: 10, marginTop: 2, color: '#4b5563', fontWeight: '600' }}>Level</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('GameLevelScreen')} style={{ alignItems: 'center', flex: 1 }}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/guarantee.png' }} style={{ width: 30, height: 30 }} />
                <Text style={{ fontSize: 10, marginTop: 2, color: '#4b5563', fontWeight: '600' }}>Game Level</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('InfluenceScreen')} style={{ alignItems: 'center', flex: 1 }}>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/group.png' }} style={{ width: 30, height: 30 }} />
                <Text style={{ fontSize: 10, marginTop: 2, color: '#4b5563', fontWeight: '600' }}>Influence</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 1, backgroundColor: '#f3f4f6', marginBottom: 10 }} />

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => navigation.navigate('CoinScreen')} style={{ flex: 1, borderRightWidth: 1, borderColor: '#f3f4f6' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
                  <Text style={{ color: '#374151', fontWeight: '700', fontSize: 12 }}>Coins</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ color: '#9ca3af', fontSize: 10, fontWeight: '500' }}>Recharge</Text><ChevronRight color="#9ca3af" size={12} /></View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Image source={{ uri: 'https://img.icons8.com/fluency/96/coins.png' }} style={{ width: 18, height: 18 }} />
                  <Text style={{ fontSize: 15, fontWeight: '800', marginLeft: 4, color: '#111827' }}>7</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, paddingLeft: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#374151', fontWeight: '700', fontSize: 11 }}>LUEX CREDIT</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ color: '#9ca3af', fontSize: 10, fontWeight: '500' }}>Cash Out</Text><ChevronRight color="#9ca3af" size={12} /></View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Image source={{ uri: 'https://img.icons8.com/color/96/jelly-bean.png' }} style={{ width: 18, height: 18 }} />
                  <Text style={{ fontSize: 15, fontWeight: '800', marginLeft: 4, color: '#111827' }}>74</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Second Card - 3 rows grid matching the first image */}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 10 }}>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              <TouchableOpacity onPress={() => navigation.navigate('MedalAndTitleScreen')} style={{ flex: 1, backgroundColor: '#f4efff', paddingLeft: 10, justifyContent: 'center', borderRadius: 10, height: 50, position: 'relative', overflow: 'hidden' }}>
                <Text style={{ fontWeight: '500', color: '#1f2937', fontSize: 10, zIndex: 1 }}>Medal & Title</Text>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/upload.png' }} style={{ width: 28, height: 28, position: 'absolute', right: 0, bottom: -4, opacity: 0.3 }} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.navigate('CPSpaceScreen')}
                style={{ flex: 1, backgroundColor: '#effbfb', paddingLeft: 10, justifyContent: 'center', borderRadius: 10, height: 50, position: 'relative', overflow: 'hidden' }}
              >
                <Text style={{ fontWeight: '500', color: '#1f2937', fontSize: 10, zIndex: 1 }}>CP Space</Text>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/pie-chart.png' }} style={{ width: 28, height: 28, position: 'absolute', right: 0, bottom: -4, opacity: 0.3 }} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              <TouchableOpacity onPress={() => navigation.navigate('StoreScreen')} style={{ flex: 1, backgroundColor: '#fff7ed', paddingLeft: 10, justifyContent: 'center', borderRadius: 10, height: 50, position: 'relative', overflow: 'hidden' }}>
                <Text style={{ fontWeight: '500', color: '#1f2937', fontSize: 10, zIndex: 1 }}>Store</Text>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/clipboard.png' }} style={{ width: 28, height: 28, position: 'absolute', right: 0, bottom: -4, opacity: 0.3 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('BackpackScreen')} style={{ flex: 1, backgroundColor: '#fff1f6', paddingLeft: 10, justifyContent: 'center', borderRadius: 10, height: 50, position: 'relative', overflow: 'hidden' }}>
                <Text style={{ fontWeight: '500', color: '#1f2937', fontSize: 10, zIndex: 1 }}>Back Pack</Text>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/envelope-with-heart.png' }} style={{ width: 28, height: 28, position: 'absolute', right: 0, bottom: -4, opacity: 0.3 }} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity onPress={() => navigation.navigate('InviteFriendScreen')} style={{ flex: 1, backgroundColor: '#fff1f2', paddingLeft: 10, justifyContent: 'center', borderRadius: 10, height: 50, position: 'relative', overflow: 'hidden' }}>
                <Text style={{ fontWeight: '500', color: '#1f2937', fontSize: 10, zIndex: 1 }}>Invite Friend</Text>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/chat.png' }} style={{ width: 28, height: 28, position: 'absolute', right: 0, bottom: -4, opacity: 0.3 }} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.navigate('MysteryScreen')}
                style={{ flex: 1, backgroundColor: '#f5f3ff', paddingLeft: 10, justifyContent: 'center', borderRadius: 10, height: 50, position: 'relative', overflow: 'hidden' }}
              >
                <Text style={{ fontWeight: '500', color: '#1f2937', fontSize: 10, zIndex: 1 }}>Mystery</Text>
                <Image source={{ uri: 'https://img.icons8.com/fluency/96/gift.png' }} style={{ width: 28, height: 28, position: 'absolute', right: 0, bottom: -4, opacity: 0.3 }} />
              </TouchableOpacity>
            </View>

          </View>

          {/* Third Card - Bottom row */}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')} style={{ alignItems: 'center', flex: 1 }}>
                <User color="#4b5563" size={26} strokeWidth={1.5} />
                <Text style={{ fontSize: 10, marginTop: 4, color: '#4b5563', fontWeight: '500' }}>Account</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('SettingScreen')} style={{ alignItems: 'center', flex: 1 }}>
                <Settings color="#4b5563" size={26} strokeWidth={1.5} />
                <Text style={{ fontSize: 10, marginTop: 4, color: '#4b5563', fontWeight: '500' }}>Setting</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('FollowUsScreen')} style={{ alignItems: 'center', flex: 1 }}>
                <BookmarkPlus color="#4b5563" size={26} strokeWidth={1.5} />
                <Text style={{ fontSize: 10, marginTop: 4, color: '#4b5563', fontWeight: '500' }}>Follow Us</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('CustomerServiceScreen')} style={{ alignItems: 'center', flex: 1 }}>
                <HelpCircle color="#4b5563" size={26} strokeWidth={1.5} />
                <Text style={{ fontSize: 10, marginTop: 4, color: '#4b5563', fontWeight: '500', textAlign: 'center' }}>Customer{'\n'}Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
