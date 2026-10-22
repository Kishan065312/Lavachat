import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Easing,
  ImageBackground,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { Chip } from 'react-native-paper';
import { Search, Home, Users, Bell, Plus, AudioLines, Heart, ShoppingBag, User, Gamepad2, Compass, MessageCircle, Globe, X, ChevronRight } from 'lucide-react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomList, joinRoom, addToRecentRooms, closeMinimizedRoom } from '../store/slices/roomSlice';
import signalRService from '../services/signalRService';
import { setProfile } from '../store/slices/authSlice';
import apiService from '../services/apiService';
const { width } = Dimensions.get('window');

const banners = [
  require('../assets/banner_1.jpeg'),
  require('../assets/banner_2.png'),
];

const featureCards = [

  {
    id: 'Realtonship',
    title: 'Relationship',
    colorFrom: '#2F80ED', // Blue
    colorTo: '#56CCF2',
    avatars: [
      require('../assets/av1.jpg'),
      require('../assets/av1.jpg'),
      require('../assets/av1.jpg'),
    ],
    animate: true,
  },
  {
    id: 'family',
    title: 'Family',
    colorFrom: '#FF416C', // Red/Pink
    colorTo: '#FF4B2B',
    avatars: [
      require('../assets/av1.jpg'),
      require('../assets/av1.jpg'),
      require('../assets/av1.jpg'),
    ],
    animate: true,
  },
];

const baseCategories = [
  { id: 'contribution', title: '1', colorFrom: '#00C9FF', colorTo: '#92FE9D', image: require('../assets/av1.jpg') },
  { id: 'charm', title: '2', colorFrom: '#B06AB3', colorTo: '#4568DC', image: require('../assets/av1.jpg') },
  { id: 'activity', title: '3', colorFrom: '#F2C94C', colorTo: '#F2994A', image: require('../assets/av1.jpg') },
  { id: 'relationship', title: '4', colorFrom: '#2F80ED', colorTo: '#56CCF2', image: require('../assets/av1.jpg') },
  { id: 'family', title: '5', colorFrom: '#FF416C', colorTo: '#FF4B2B', image: require('../assets/av1.jpg') },
  { id: 'trending', title: '6', colorFrom: '#f12711', colorTo: '#f5af19', image: require('../assets/av1.jpg') },
];

const categories = Array.from({ length: 66 }).map((_, index) => {
  const base = baseCategories[index % baseCategories.length];
  return {
    ...base,
    id: `${base.id}-${index}`,
    title: `${index + 1}`
  };
});

// const gridCards = [
//   {
//     id: 'g1',
//     title: 'Dairymilk',
//     img: require('../assets/grid1.jpg'),
//     live: 5,
//   },
//   {
//     id: 'g2',
//     title: 'Game Party',
//     img: require('../assets/grid1.jpg'),
//     live: 16,
//   },
//   {
//     id: 'g3',
//     title: 'Welcome New User',
//     img: require('../assets/grid1.jpg'),
//     live: 6,
//   },
//   { id: 'g4', title: 'MIC GRAB', img: require('../assets/grid1.jpg'), live: 6 },
// ];

const styles = StyleSheet.create({
  avatarRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 10,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Dark background
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    color: colors.textDim,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: colors.primary,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '700',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  navBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  navDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.background,
  },
});

function BannerCarousel() {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const next = (index + 1) % banners.length;
      // scrollRef.current?.scrollTo({ x: next * width, animated: true });
      scrollRef.current?.scrollTo({
        x: next * (Dimensions.get('window').width - 32),
        animated: true,
      });

      setIndex(next);
    }, 3000);

    return () => clearInterval(id);
  }, [index]);

  return (
    <View style={{ width, height: verticalScale(100), marginTop: 0, paddingHorizontal: 16 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ev => {
          const i = Math.round(ev.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
      >
        {banners.map((b, i) => (
          <Image key={i} source={b} style={[globalStyles.banner, { height: verticalScale(100) }]} resizeMode="cover" />
        ))}
      </ScrollView>

      <View style={globalStyles.dots}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[globalStyles.dot, index === i && globalStyles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

function FeatureCards() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10,
      }}
    >
      {featureCards.map((card) => (
        <View key={card.id} style={{ width: '40%' }}>
          <FeatureCard card={card} />
        </View>
      ))}
    </View>
  );
}

function FeatureCard({ card }) {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!card.animate) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [card.animate, blinkAnim]);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 4 }}>{card.title}</Text>
      <LinearGradient
        colors={[card.colorFrom, card.colorTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[globalStyles.featureCard, { width: '100%', height: verticalScale(28), borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 0 }]}
      >
        {/* Avatars - blinking section */}
        {card.avatars.length > 0 && (
          <Animated.View style={[styles.avatarRow, { opacity: blinkAnim }]}>
            {card.avatars.map((a, i) => (
              <Image
                key={i}
                source={a}
                style={[
                  globalStyles.avatarMini,
                  { width: 22, height: 22, borderRadius: 11, marginLeft: i === 0 ? 0 : -8, borderWidth: 1.5, borderColor: "#fff" },
                ]}
              />
            ))}
          </Animated.View>
        )}
        {card.icon && (
          <Image
            source={card.icon}
          />
        )}
      </LinearGradient>
    </View>
  );
}

function CategorySlider() {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const itemWidth = width / 6;
  const totalWidth = 66 * itemWidth;

  useEffect(() => {
    Animated.loop(
      Animated.timing(slideAnim, {
        toValue: -totalWidth,
        duration: 60000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [slideAnim, totalWidth]);

  // Duplicate categories to create a seamless loop
  const marqueeItems = [...categories, ...categories];

  return (
    <View style={{ marginBottom: 15, overflow: 'hidden' }}>
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [{ translateX: slideAnim }]
        }}
      >
        {marqueeItems.map((cat, index) => (
          <View key={`${cat.id}-${index}`} style={{ alignItems: 'center', width: itemWidth }}>
            <LinearGradient
              colors={[cat.colorFrom, cat.colorTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 6, overflow: 'hidden' }}
            >
              <Image
                source={cat.image}
                style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: '#fff' }}
              />
            </LinearGradient>
            <Text style={{ fontSize: 10, fontWeight: '500', color: colors.text, textAlign: 'center' }} numberOfLines={1}>
              {cat.title}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

function FilterPills() {
  const [active, setActive] = useState("All");
  const pills = ["All", "India", "Saudi Arabia",];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={true}
      contentContainerStyle={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scale(10),
      }}
    >
      {/* {pills.map((p) => {
        const isActive = active === p;

        return (
          <TouchableOpacity
            key={p}
            onPress={() => setActive(p)}
            style={[
              globalStyles.pillBase,
              isActive ? globalStyles.pillActive : globalStyles.pillInactive,
            ]}
            activeOpacity={0.8}
          >
            {isActive ? (
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={globalStyles.pillGradient}
              >
                <Text style={globalStyles.pillActiveText}>{p}</Text>
              </LinearGradient>
            ) : (
              <Text style={globalStyles.pillInactiveText}>{p}</Text>
            )}
          </TouchableOpacity>
        );
      })} */}
    </ScrollView>
  );
}




function GridCards({ data, loading, ListHeaderComponent, onJoinRoom }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[globalStyles.gridCard, { borderColor: colors.border, flexDirection: 'row', padding: 8, height: 90, alignItems: 'center' }]}
      onPress={() => onJoinRoom(item)}
      activeOpacity={0.8}
    >
      {/* Left Side: Image */}
      <View style={{ width: '45%', height: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden' }}>
        <Image
          source={item.imagePath ? { uri: item.imagePath } : require('../assets/grid1.jpg')}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      </View>

      {/* Right Side: Data */}
      <View style={{ width: '55%', paddingLeft: 8, justifyContent: 'center' }}>
        <Text style={{ color: colors.text, fontSize: 13, fontWeight: 'bold' }} numberOfLines={1}>
          {item.title || "Room Title"}
        </Text>
        <Text style={{ color: colors.textDim, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
          {item.creatorName || "User"}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 6 }}>
          <Text style={{ color: colors.text, fontSize: 13, fontWeight: 'bold' }}>
            {item.participantCount || 0}
          </Text>
          <Text style={{ color: colors.primary, fontSize: 10, marginLeft: 4, fontWeight: 'bold' }}>
            Live
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      ListHeaderComponent={ListHeaderComponent}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id.toString() + index}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}
      contentContainerStyle={{ paddingBottom: 120, paddingTop: 0 }}
      ItemSeparatorComponent={() => <View style={{ height: verticalScale(12) }} />}
      ListEmptyComponent={() => (
        <View style={{ alignItems: 'center', paddingTop: 40 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>No rooms found</Text>
        </View>
      )}
    />
  );
}

function BottomNav({ onCenterPress }) {
  return (
    <View style={[globalStyles.bottomNav, { height: 60, borderRadius: 0, left: 0, right: 0, bottom: 0, borderWidth: 0, borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.background, elevation: 20 }]}>
      <TouchableOpacity style={styles.navTab}>
        <Home width={22} height={22} color={colors.primary} />
        <Text style={styles.navTextActive}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navTab}>
        <Gamepad2 width={22} height={22} color={colors.textDim} />
        <Text style={styles.navText}>Event</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navTab}>
        <Compass width={22} height={22} color={colors.textDim} />
        <Text style={styles.navText}>Moment</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navTab}>
        <View style={{ position: 'relative' }}>
          <MessageCircle width={22} height={22} color={colors.textDim} />
          <View style={styles.navBadge}><Text style={styles.navBadgeText}>21</Text></View>
        </View>
        <Text style={styles.navText}>Message</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navTab}>
        <View style={{ position: 'relative' }}>
          <User width={22} height={22} color={colors.textDim} />
          <View style={styles.navDot} />
        </View>
        <Text style={styles.navText}>Me</Text>
      </TouchableOpacity>
    </View>
  );
}

// AudioWave Component for Loading Animation
const AudioWave = () => {
  const bars = [useRef(new Animated.Value(10)).current, useRef(new Animated.Value(15)).current, useRef(new Animated.Value(20)).current, useRef(new Animated.Value(12)).current];

  useEffect(() => {
    const anims = bars.map((bar, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: [25, 35, 30, 25][i],
            duration: [400, 500, 450, 400][i],
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: [10, 15, 10, 12][i],
            duration: [400, 500, 450, 400][i],
            useNativeDriver: false,
          }),
        ])
      );
    });

    Animated.parallel(anims).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, gap: 4, marginBottom: 10 }}>
      {bars.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: anim,
            backgroundColor: colors.tertiary,
            borderRadius: 3,
          }}
        />
      ))}
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { userId, profile } = useSelector((state) => state.auth);
  const { rooms, loading, recentRooms } = useSelector((state) => state.room);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [activeTab, setActiveTab] = useState('Popular');
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const TABS = ['Recent', 'Popular', 'Official', 'Friends', 'Relationship', 'Followers', 'Gaming'];

  const COUNTRIES = [
    { id: 'all', name: 'Global', flag: '🌍' },
    { id: 'in', name: 'India', flag: '🇮🇳' },
    { id: 'us', name: 'USA', flag: '🇺🇸' },
    { id: 'uk', name: 'UK', flag: '🇬🇧' },
    { id: 'pk', name: 'Pakistan', flag: '🇵🇰' },
    { id: 'bd', name: 'Bangladesh', flag: '🇧🇩' },
    { id: 'ae', name: 'UAE', flag: '🇦🇪' },
  ];

  const handleCardPress = async (room) => {
    try {
      setIsJoiningRoom(true);
      const currentUserId = userId || 1006;

      console.log('🔌 Proceeding to API Join...');
      console.log("🔌 Connecting to SignalR...");

      // 1️⃣ CONNECT SIGNALR
      const result = await signalRService.startConnection(currentUserId);

      const connectionId = signalRService.getConnectionId();
      console.log("🔗 Connection ID:", connectionId);

      if (result !== true) {
        const errorMessage = result?.message || result?.toString() || "Unknown Error";
        Alert.alert("Connection Failed", `Reason: ${errorMessage}`);
        setIsJoiningRoom(false);
        return;
      }

      console.log("🔥 SignalR Connected!");

      // Step 2: Call Join Room API (REST API, not SignalR)
      const resultAction = await dispatch(joinRoom({
        roomId: room.id,
        userId: currentUserId,
        connectionId: connectionId // Include ConnectionID for Backend
      }));

      if (joinRoom.fulfilled.match(resultAction)) {
        console.log(`📥 Joined room ${room.id} via API`);

        // Add to Recent Rooms
        dispatch(addToRecentRooms(room));

        // Close any existing floating widget
        dispatch(closeMinimizedRoom());

        setIsJoiningRoom(false);
        navigation.navigate('ChatScreen', {
          roomData: room
        });
      } else {
        Alert.alert("Error", "Failed to join room");
        await signalRService.stopConnection();
        setIsJoiningRoom(false);
      }
    } catch (error) {
      console.error("Join Room Error:", error);
      Alert.alert("Error", "Something went wrong");
      await signalRService.stopConnection();
      setIsJoiningRoom(false);
    }
  };

  const handleHomePress = async () => {
    try {
      setIsJoiningRoom(true);
      const currentUserId = userId || 1006;
      console.log("🏠 Home Press Debug - UserID:", currentUserId);

      // Log: Calling API
      console.log(`📡 Calling Profile API: api/User/${currentUserId}/profile`);
      const response = await apiService.get(`api/User/${currentUserId}/profile`);

      // Log: Full Response
      console.log("✅ API Response Data:", JSON.stringify(response.data, null, 2));

      // Fix: API returns data directly, or try both to be safe
      const profileData = response.data?.data || response.data;
      console.log("🧐 Check - isRoomParticipant:", profileData?.isRoomParticipant, " | roomId:", profileData?.roomId);

      if (profileData?.isRoomParticipant && profileData?.roomId) {

        console.log(`➡️ Re-Joining ChatScreen (Room ID: ${profileData.roomId})`);
        dispatch(closeMinimizedRoom());
        await handleCardPress({ id: profileData.roomId });
      } else {
        console.log("➡️ Navigating to CreateRoomScreen (User not in room)");
        setIsJoiningRoom(false);
        navigation.navigate("CreateRoomScreen");
      }
    } catch (error) {
      console.error("❌ Home Press Error:", error);
      if (error.response) {
        console.log("⚠️ Error Response:", error.response.status, JSON.stringify(error.response.data));
      }
      setIsJoiningRoom(false);
      navigation.navigate("CreateRoomScreen");
    }
  };

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen');
  };

  useEffect(() => {
    // Fetch room list on component mount
    dispatch(fetchRoomList());

    // Fetch profile on component mount
    if (userId) {
      const fetchProfile = async () => {
        try {
          const response = await apiService.get(`api/User/${userId}/profile`);
          if (response.success && response.data) {
            dispatch(setProfile(response.data));
          }
        } catch (error) {
          console.error("Error fetching profile on HomeScreen:", error);
        }
      };
      fetchProfile();
    }

    const interval = setInterval(() => {
      dispatch(fetchRoomList());
    }, 5000000);

    return () => clearInterval(interval);
  }, [dispatch, userId]);

  // Determine which data to show
  const getDisplayData = () => {
    if (activeTab === 'Recent') {
      return recentRooms; // recentRooms is already LIFO (most recent first)
    }
    if (activeTab === 'Following') {
      return []; // Placeholder for following rooms
    }

    // Default: Popular
    // 1. Start with LIFO (newest first)
    let sorted = rooms ? [...rooms].reverse() : [];

    // 2. Sort so that rooms with participants (>0) come first, and empty rooms (0) come last
    return sorted.sort((a, b) => {
      const countA = a.participantCount || 0;
      const countB = b.participantCount || 0;

      if (countA > 0 && countB === 0) return -1;
      if (countA === 0 && countB > 0) return 1;

      // If both have people or both are empty, keep the LIFO order
      return 0;
    });
  };

  return (
    <View style={globalStyles.screen}>
      <View style={{ backgroundColor: colors.background, zIndex: 10, elevation: 10 }}>
        {/* Top Profile Header (Based on Reference) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 10, justifyContent: 'space-between' }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Me')}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
              {(profile?.avatarUrl || profile?.profilePictureUrl) ? (
                <Image
                  source={{
                    uri: (profile.avatarUrl || profile.profilePictureUrl).startsWith('http')
                      ? (profile.avatarUrl || profile.profilePictureUrl)
                      : `https://landing.hostingsky.in${profile.avatarUrl || profile.profilePictureUrl}`
                  }}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              ) : (
                <Image
                  source={require('../assets/av1.jpg')}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              )}
            </View>
            <View>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>
                {profile?.displayName || profile?.name || "Guest"}
              </Text>
              <Text style={{ color: colors.textDim, fontSize: 12 }}>Lv.28</Text>
            </View>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
              <Globe width={22} height={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSearchPress}>
              <Search width={22} height={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHomePress}>
              <Home width={22} height={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      <GridCards
        data={getDisplayData()}
        loading={loading && activeTab !== 'Recent'}
        navigation={navigation}
        onJoinRoom={handleCardPress}
        ListHeaderComponent={
          <>
            {activeTab !== 'Recent' && <BannerCarousel />}

            {/* Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 5 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {TABS.map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{ marginRight: 24, paddingTop: 5, paddingBottom: 10, position: 'relative' }}
                >
                  <Text style={{ fontSize: 15, color: activeTab === tab ? colors.primary : colors.textDim, fontWeight: activeTab === tab ? 'bold' : '500' }}>
                    {tab}
                  </Text>
                  {activeTab === tab && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: colors.primary, borderRadius: 1.5 }} />}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {activeTab !== 'Recent' && (
              <>
                <View style={{ height: verticalScale(8) }} />
                {activeTab === 'Popular' && (
                  <>
                    <FeatureCards />
                    <CategorySlider />
                  </>
                )}
                <FilterPills />
                <View style={{ height: verticalScale(4) }} />
              </>
            )}
          </>
        }
      />



      {/* ENTERING ROOM LOADING MODAL */}
      <Modal
        transparent={true}
        visible={isJoiningRoom}
        animationType="fade"
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            {/* Animated Wave */}
            <AudioWave />
            <Text style={styles.loadingText}>Entering room</Text>
          </View>
        </View>
      </Modal>

      {/* COUNTRY SELECTION MODAL */}
      <Modal
        visible={isCountryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setCountryModalVisible(false)}
        >
          <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' }}>
            <View style={{ width: 40, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Select Country</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border }}
                  onPress={() => {
                    setSelectedCountry(item.name);
                    setCountryModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: 24, marginRight: 15 }}>{item.flag}</Text>
                  <Text style={{ color: selectedCountry === item.name ? colors.primary : colors.text, fontSize: 16, flex: 1, fontWeight: selectedCountry === item.name ? 'bold' : '500' }}>
                    {item.name}
                  </Text>
                  {selectedCountry === item.name && (
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

