import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, StatusBar, FlatList, Animated, Platform, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle, G, Polygon, SvgUri } from 'react-native-svg';
import { ChevronLeft, List, Info } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import apiService from '../services/apiService';
import { SvgaPlayer } from '@jayming/svga-player-rn';

const { width } = Dimensions.get('window');
const BADGE_WIDTH = 190;
const BADGE_HEIGHT = 220;

const getSvgaSource = (requireAsset, itemIndex) => {
    if (__DEV__) {
        const resolved = Image.resolveAssetSource(requireAsset);
        return resolved?.uri;
    } else {
        if (Platform.OS === 'android') {
            return `svip_svga_medal_${itemIndex}.svga`;
        }
        const resolved = Image.resolveAssetSource(requireAsset);
        return resolved?.uri;
    }
};

const IconImage = ({ source, style, resizeMode = 'contain' }) => {
    const [hasSvgError, setHasSvgError] = useState(false);

    if (!source) return null;

    let uri = null;
    if (typeof source === 'string') {
        uri = source;
    } else if (source) {
        const resolved = Image.resolveAssetSource(source);
        uri = resolved?.uri;
    }

    const flatStyle = StyleSheet.flatten(style) || {};
    const { width = 36, height = 36, opacity = 1, transform = [], tintColor, ...cleanStyle } = flatStyle;

    const isSvg = uri && (uri.toLowerCase().includes('.svg') || (typeof source === 'number' && String(uri).toLowerCase().includes('.svg')));

    if (isSvg && uri && !hasSvgError) {
        return (
            <View style={[{ width, height, opacity, justifyContent: 'center', alignItems: 'center', overflow: 'visible' }, { transform }]}>
                <SvgUri
                    uri={uri}
                    width={String(width)}
                    height={String(height)}
                    preserveAspectRatio="xMidYMid meet"
                    onError={(err) => {
                        console.log('SvgUri Error:', err);
                        setHasSvgError(true);
                    }}
                />
            </View>
        );
    }

    return (
        <Image
            source={typeof source === 'string' ? { uri: source } : source}
            style={[cleanStyle, { width, height, opacity, transform }]}
            resizeMode={resizeMode}
        />
    );
};

const svipImages = {
    1: require('../assets/svip_svga_medal_1.svga'),
    2: require('../assets/svip_svga_medal_2.svga'),
    3: require('../assets/svip_svga_medal_3.svga'),
    4: require('../assets/svip_svga_medal_4.svga'),
    5: require('../assets/svip_svga_medal_5.svga'),
    6: require('../assets/svip_svga_medal_6.svga'),
    7: require('../assets/svip_svga_medal_7.svga'),
    8: require('../assets/svip_svga_medal_8.svga'),
    9: require('../assets/9.jpeg'),
    10: require('../assets/10.jpeg'),
    11: require('../assets/11.jpeg'),
    12: require('../assets/12.jpeg'),
    13: require('../assets/13.jpeg'),
    14: require('../assets/14.jpeg'),
    15: require('../assets/15.jpeg'),
};

const LEVELS = Array.from({ length: 15 }, (_, i) => i + 1);

const levelRequirements = {
    1: { topUp: 12000, send: 8000 },
    2: { topUp: 50000, send: 30000 },
    3: { topUp: 150000, send: 100000 },
    4: { topUp: 400000, send: 250000 },
    5: { topUp: 1000000, send: 600000 },
    6: { topUp: 2000000, send: 1200000 },
    7: { topUp: 4000000, send: 2500000 },
    8: { topUp: 8000000, send: 5000000 },
    9: { topUp: 15000000, send: 10000000 },
    10: { topUp: 25000000, send: 18000000 },
    11: { topUp: 40000000, send: 30000000 },
    12: { topUp: 60000000, send: 45000000 },
    13: { topUp: 90000000, send: 70000000 },
    14: { topUp: 130000000, send: 100000000 },
    15: { topUp: 180000000, send: 140000000 },
};

const getIconSource = (icon) => {
    if (!icon) return null;
    if (typeof icon === 'string') return { uri: icon };
    return icon;
};

const privilegesData = [
    { id: '1', title: 'Coin Reward', smallIcon: require("../assets/24- Coin rewrd.png"), largeIcon: require("../assets/24- Coin rewrd.png"), description: 'Get exclusive daily coin rewards' },
    { id: '2', title: 'Title', smallIcon: require("../assets/25-  VIP Title.png"), largeIcon: require("../assets/25-  VIP Title.png"), description: 'Unlock a premium title showing your status' },
    { id: '3', title: 'Frame', smallIcon: require('../assets/26- Profile Frame.png'), largeIcon: require('../assets/26- Profile Frame.png'), description: 'Exclusive nameplate and avatar border' },
    { id: '4', title: 'SVIP medal', smallIcon: require('../assets/27- SVIP Medal.png'), largeIcon: require('../assets/27- SVIP Medal.png'), description: 'Showcase your rare SVIP honor medal' },
    { id: '5', title: 'Tiny Profile Card', smallIcon: require('../assets/28- Tiny Profile Card.png'), largeIcon: require('../assets/28- Tiny Profile Card.png'), description: 'Sleek tiny profile card customization' },
    { id: '6', title: 'Chat Bubble', smallIcon: require('../assets/29- Chat Bubble.png'), largeIcon: require('../assets/29- Chat Bubble.png'), description: 'Special chat bubble styles for SVIP' },
    { id: '7', title: 'Exclusive Mic', smallIcon: require('../assets/30- Exclusive Microphone.png'), largeIcon: require('../assets/30- Exclusive Microphone.png'), description: 'Stand out on the mic with premium style' },
    { id: '8', title: 'Send room Image', smallIcon: require('../assets/08- Send Room Images.png'), largeIcon: require('../assets/08- Send Room Images.png'), description: 'Permission to send custom images in chat rooms' },
    { id: '9', title: 'Top of List', smallIcon: require('../assets/02- Top of Room List.png'), largeIcon: require('../assets/02- Top of Room List.png'), description: 'Pinned to the top of the room visitor list' },
    { id: '10', title: 'View visitor profile', smallIcon: require('../assets/01- View Visitor Profile.png'), largeIcon: require('../assets/01- View Visitor Profile.png'), description: 'Privilege to view details of room visitors' },
    { id: '11', title: 'Profile background', smallIcon: require('../assets/04- Profile Background.png'), largeIcon: require('../assets/04- Profile Background.png'), description: 'Set customized high-definition profile backgrounds' },
    { id: '12', title: 'Carrom Screen', smallIcon: require('../assets/31- Carrom Theme.png'), largeIcon: require('../assets/31- Carrom Theme.png'), description: 'Exclusive premium skins for Carrom game screen' },
    { id: '13', title: 'Ludo skin', smallIcon: require('../assets/05- Ludo Dice Theme.png'), largeIcon: require('../assets/05- Ludo Dice Theme.png'), description: 'Unlock special boards and tokens in Ludo' },
    { id: '14', title: 'Ludo Dice Screen', smallIcon: require('../assets/06- Ludo Dice Theme.png'), largeIcon: require('../assets/06- Ludo Dice Theme.png'), description: 'Exclusive dice rolling screen effects in Ludo' },
    { id: '15', title: 'SVIP Emoji', smallIcon: require('../assets/07- SVIP Emoji.png'), largeIcon: require('../assets/07- SVIP Emoji.png'), description: 'Access to custom animated SVIP-only emojis' },
    { id: '16', title: 'Send message Image', smallIcon: require('../assets/03- Send Image Messages.png'), largeIcon: require('../assets/03- Send Image Messages.png'), description: 'Send photos directly in private chat messages' },
    { id: '17', title: 'SVIP Gift', smallIcon: require('../assets/09- SVIP Gift.png'), largeIcon: require('../assets/09- SVIP Gift.png'), description: 'Access to exclusive SVIP-only virtual gifts' },
    { id: '18', title: 'Multiple profile backgrounds', smallIcon: require('../assets/10- Multiple Profile Backgrounds.png'), largeIcon: require('../assets/10- Multiple Profile Backgrounds.png'), description: 'Upload and rotate multiple profile backgrounds' },
    { id: '19', title: 'Dynamic Nickname', smallIcon: require('../assets/11- Dynamic Nickname.png'), largeIcon: require('../assets/11- Dynamic Nickname.png'), description: 'Glow effect on nickname in room lists' },
    { id: '20', title: 'Hide visit records', smallIcon: require('../assets/13- Hide Visit Records.png'), largeIcon: require('../assets/13- Hide Visit Records.png'), description: 'Visit profiles anonymously without leaving traces' },
    { id: '21', title: 'Custom Theme', smallIcon: require('../assets/14- Custom Theme.png'), largeIcon: require('../assets/14- Custom Theme.png'), description: 'Personalize the color theme of your app UI' },
    { id: '22', title: 'Digital Signature Uploading', smallIcon: require('../assets/33- Digital Signature Upload.png'), largeIcon: require('../assets/33- Digital Signature Upload.png'), description: 'Upload handwritten digital signatures to profile' },
    { id: '23', title: 'SVIP LUEX Credit 5% Return', smallIcon: require('../assets/37- LUEX Credit Return.png'), largeIcon: require('../assets/37- LUEX Credit Return.png'), description: 'Earn 5% credit back on SVIP transactions' },
    { id: '24', title: 'Hide online status', smallIcon: require('../assets/15- Hide Online Status.png'), largeIcon: require('../assets/15- Hide Online Status.png'), description: 'Appear offline while browsing and chatting' },
    { id: '25', title: 'Send gif when chatting', smallIcon: require('../assets/32- Send GIF in Chat.png'), largeIcon: require('../assets/32- Send GIF in Chat.png'), description: 'Send high-quality GIFs in public and private chats' },
    { id: '26', title: 'Exclusive Entry', smallIcon: require('../assets/35- Exclusive Entry.png'), largeIcon: require('../assets/35- Exclusive Entry.png'), description: 'Exclusive entrance effects when joining rooms' },
    { id: '27', title: 'Can\'t be kicked', smallIcon: require('../assets/18- Can\'t Be Kicked.png'), largeIcon: require('../assets/18- Can\'t Be Kicked.png'), description: 'Immunity from being kicked out of chat rooms' },
    { id: '28', title: 'SID 6 digit special id', smallIcon: require('../assets/17- 6-Digit Special ID.png'), largeIcon: require('../assets/17- 6-Digit Special ID.png'), description: 'Claim a unique 6-digit short Special ID' },
    { id: '29', title: 'GIF Profile Picture', smallIcon: require('../assets/19- GIF Profile Picture.png'), largeIcon: require('../assets/19- GIF Profile Picture.png'), description: 'Upload animated GIFs as your profile avatar' },
    { id: '30', title: 'Can\'t be ban public chat', smallIcon: require('../assets/20- Can\'t Be Banned in Public Chat.png'), largeIcon: require('../assets/20- Can\'t Be Banned in Public Chat.png'), description: 'Immunity from public chat bans' },
    { id: '31', title: 'Room SVIP Frame', smallIcon: require('../assets/34- Room SVIP Frame.png'), largeIcon: require('../assets/34- Room SVIP Frame.png'), description: 'Exclusive host frame in chat rooms' },
    { id: '32', title: 'Unban account ×1', smallIcon: require('../assets/21- Unban Account.png'), largeIcon: require('../assets/21- Unban Account.png'), description: 'One-time instant account unban token' },
    { id: '33', title: 'SID 5 Digit Special id', smallIcon: require('../assets/22- 5-Digit Special ID.png'), largeIcon: require('../assets/22- 5-Digit Special ID.png'), description: 'Claim an ultra-rare 5-digit short Special ID' },
    { id: '34', title: 'Intimacy Acceleration', smallIcon: require('../assets/36- Intimacy Acceleration.png'), largeIcon: require('../assets/36- Intimacy Acceleration.png'), description: 'Boost intimacy points earned with friends by 2x' },
    { id: '35', title: 'Private Chat Theme', smallIcon: require('../assets/16- Avoid disturbing.png'), largeIcon: require('../assets/16- Avoid disturbing.png'), description: 'Customize chat wallpapers for DM sessions' },
    { id: '36', title: 'Exclusive Dynamic Name', smallIcon: require('../assets/25-  VIP Title Color Change.png'), largeIcon: require('../assets/25-  VIP Title Color Change.png'), description: 'Flowing animated display of your profile name' },
    { id: '37', title: 'Ban account', smallIcon: require('../assets/23- ban Account.png'), largeIcon: require('../assets/23- ban Account.png'), description: 'Kick/Ban permissions for room management' },
    // { id: '38', title: 'Profile Flash', smallIcon: require('../assets/38- Profile Flash.png'), largeIcon: require('../assets/38- Profile Flash.png'), description: 'Sparkling flash effects when loading your profile' },
    // { id: '39', title: 'SVIP exclusive ring', smallIcon: require('../assets/39- SVIP exclusive ring.png'), largeIcon: require('../assets/39- SVIP exclusive ring.png'), description: 'Unique profile ring decoration badge' },
    // { id: '40', title: 'Flying Screen Gift Effects', smallIcon: require('../assets/40- Flying Screen Gift Effects.png'), largeIcon: require('../assets/40- Flying Screen Gift Effects.png'), description: 'Screen-wide animations for sending gifts' },
    // { id: '41', title: 'Luxury Lucky Bag', smallIcon: 'https://img.icons8.com/color/96/money-bag.png', largeIcon: 'https://img.icons8.com/color/256/money-bag.png', description: 'Send high-value lucky bags to room listeners' },
    // { id: '42', title: 'Exclusive Microphone Style', smallIcon: 'https://img.icons8.com/color/96/singing.png', largeIcon: 'https://img.icons8.com/color/256/singing.png', description: 'Special mic boundary glow for hosts' },
    // { id: '43', title: 'Flying Screen', smallIcon: 'https://img.icons8.com/color/96/kite.png', largeIcon: 'https://img.icons8.com/color/256/kite.png', description: 'Screen flying messages that bypass scrolling' },
    // { id: '44', title: 'Room Announcement (Img+Txt)', smallIcon: 'https://img.icons8.com/color/96/bullhorn.png', largeIcon: 'https://img.icons8.com/color/256/bullhorn.png', description: 'Format announcements with photos and texts' },
    // { id: '45', title: 'Grandmaster SVIP 10+', smallIcon: 'https://img.icons8.com/color/96/trophy.png', largeIcon: 'https://img.icons8.com/color/256/trophy.png', description: 'Special recognition badges for grandmaster level' },
    // { id: '46', title: 'Dynamic Room BG', smallIcon: 'https://img.icons8.com/color/96/landscape.png', largeIcon: 'https://img.icons8.com/color/256/landscape.png', description: 'Set animated room background wallpapers' },
    // { id: '47', title: 'Ultimate Theme Studio', smallIcon: 'https://img.icons8.com/color/96/designer.png', largeIcon: 'https://img.icons8.com/color/256/designer.png', description: 'Access fully customized app skin designs' },
    // { id: '48', title: 'Antiblock', smallIcon: 'https://img.icons8.com/color/96/lock.png', largeIcon: 'https://img.icons8.com/color/256/lock.png', description: 'Protection from room and user block actions' },
    // { id: '49', title: 'Room Stealth (Min/Day)', smallIcon: 'https://img.icons8.com/color/96/spy.png', largeIcon: 'https://img.icons8.com/color/256/spy.png', description: 'Enter any room without triggering entrance logs' },
    // { id: '50', title: 'Customized Gift', smallIcon: 'https://img.icons8.com/color/96/handshake.png', largeIcon: 'https://img.icons8.com/color/256/handshake.png', description: 'Request designers to make personalized gifts' },
    // { id: '51', title: 'GIF Profile Background', smallIcon: 'https://img.icons8.com/color/96/panorama.png', largeIcon: 'https://img.icons8.com/color/256/panorama.png', description: 'Use high-definition moving GIFs as backdrop' },
    // { id: '52', title: 'Room Flying Msg', smallIcon: 'https://img.icons8.com/color/96/paper-plane.png', largeIcon: 'https://img.icons8.com/color/256/paper-plane.png', description: 'Send highly stylized room-wide flying texts' },
    // { id: '53', title: 'Priority Support Shield', smallIcon: 'https://img.icons8.com/color/96/customer-support.png', largeIcon: 'https://img.icons8.com/color/256/customer-support.png', description: 'Direct 24/7 priority customer service shield' },
    // { id: '54', title: 'Account Recovery Priority', smallIcon: 'https://img.icons8.com/color/96/refresh.png', largeIcon: 'https://img.icons8.com/color/256/refresh.png', description: 'Fast-track priority recovery for lost accounts' },
    // { id: '55', title: 'Tiny Profile Card GIF', smallIcon: 'https://img.icons8.com/color/96/id-card-clip.png', largeIcon: 'https://img.icons8.com/color/256/id-card-clip.png', description: 'Unlock moving GIF designs for tiny profile cards' },
    // { id: '56', title: 'Family Profile GIF SVIP 12+', smallIcon: 'https://img.icons8.com/color/96/family.png', largeIcon: 'https://img.icons8.com/color/256/family.png', description: 'Display animated family badge indicators' },
    // { id: '57', title: 'Customized Entry', smallIcon: 'https://img.icons8.com/color/96/flight.png', largeIcon: 'https://img.icons8.com/color/256/flight.png', description: 'Personalized voice or graphic entry effects' },
    // { id: '58', title: 'Anti-Banned ID', smallIcon: 'https://img.icons8.com/color/96/ok.png', largeIcon: 'https://img.icons8.com/color/256/ok.png', description: 'Permanent shield protecting account ID' },
    // { id: '59', title: 'Multi-colour Dynamic Nickname', smallIcon: 'https://img.icons8.com/color/96/marker.png', largeIcon: 'https://img.icons8.com/color/256/marker.png', description: 'Dynamic gradient flow effect on user nickname' },
    // { id: '60', title: 'Ultra Mic FX System', smallIcon: 'https://img.icons8.com/color/96/equalizer.png', largeIcon: 'https://img.icons8.com/color/256/equalizer.png', description: 'Special vocal filters and sound FX on mic' },
    // { id: '61', title: 'Dominion Plate', smallIcon: 'https://img.icons8.com/color/96/user-shield.png', largeIcon: 'https://img.icons8.com/color/256/user-shield.png', description: 'Claim the ultimate SVIP Dominion badge frame' },
    // { id: '62', title: 'Avatar Evolution System', smallIcon: 'https://img.icons8.com/color/96/sync.png', largeIcon: 'https://img.icons8.com/color/256/sync.png', description: 'Avatars that upgrade details based on levels' },
    // { id: '63', title: 'Advance Room Control', smallIcon: 'https://img.icons8.com/color/96/keyhole.png', largeIcon: 'https://img.icons8.com/color/256/keyhole.png', description: 'Host access settings and control dashboard' },
    // { id: '64', title: 'Official Admin', smallIcon: 'https://img.icons8.com/color/96/manager.png', largeIcon: 'https://img.icons8.com/color/256/manager.png', description: 'Claim official helper status badge markers' },
    // { id: '65', title: 'Global Flying Msg', smallIcon: 'https://img.icons8.com/color/96/sent.png', largeIcon: 'https://img.icons8.com/color/256/sent.png', description: 'Send messages broadcasted to all active rooms' },
    // { id: '66', title: 'World Notice', smallIcon: 'https://img.icons8.com/color/96/megaphone.png', largeIcon: 'https://img.icons8.com/color/256/megaphone.png', description: 'Broadcast global app banner announcements' },
    // { id: '67', title: 'Hide country', smallIcon: 'https://img.icons8.com/color/96/globe.png', largeIcon: 'https://img.icons8.com/color/256/globe.png', description: 'Option to hide country flag marker on profile' }
];

export default function SVIPScreen() {
    const navigation = useNavigation();
    const profile = useSelector((state) => state.auth.profile);
    const userId = useSelector((state) => state.auth.userId);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedPrivilegeIndex, setSelectedPrivilegeIndex] = useState(0);
    const [svipData, setSvipData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSvipData = async () => {
            if (!userId) return;
            try {
                const res = await apiService.get(`api/SVIP/privileges/with-levels?userId=${userId}`);
                if (res?.status && res?.data) {
                    setSvipData(res.data);
                }
            } catch (error) {
                console.log("Error fetching SVIP data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSvipData();
    }, [userId]);

    const name = profile?.displayName || profile?.name || "Rahul";
    
    let avatar = null;
    const avatarUrl = profile?.avatarUrl || profile?.profilePictureUrl;
    if (avatarUrl) {
        avatar = {
            uri: avatarUrl.startsWith('http') 
                ? avatarUrl 
                : `https://landing.hostingsky.in${avatarUrl}`
        };
    }

    const scrollX = useRef(new Animated.Value(0)).current;

    const renderCarouselItem = ({ item, index }) => {
        const inputRange = [
            (index - 1) * BADGE_WIDTH,
            index * BADGE_WIDTH,
            (index + 1) * BADGE_WIDTH
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
        });

        const rotateY = scrollX.interpolate({
            inputRange,
            outputRange: ['10deg', '0deg', '-10deg'],
            extrapolate: 'clamp',
        });

        const isSvga = item <= 8;

        return (
            <Animated.View style={{ 
                width: BADGE_WIDTH, 
                height: BADGE_HEIGHT, 
                justifyContent: 'center', 
                alignItems: 'center',
                opacity,
                transform: [{ scale }, { perspective: 1000 }, { rotateY }]
            }}>
                {isSvga ? (
                    <SvgaPlayer
                        source={getSvgaSource(svipImages[item], item)}
                        style={styles.smallBadge}
                        loops={0}
                        autoPlay={true}
                        align="center"
                        clearsAfterStop={false}
                    />
                ) : (
                    <Image
                        source={svipImages[item]}
                        style={styles.smallBadge}
                        resizeMode="contain"
                    />
                )}
            </Animated.View>
        );
    };

    const currentSvipLevel = svipData?.currentLevel?.svipLevelId || 0;
    const maxVisibleLevel = Math.min(15, Math.max(3, currentSvipLevel + 3));
    const LEVELS = Array.from({ length: maxVisibleLevel }, (_, i) => i + 1);
    
    const level = LEVELS[currentIndex] || 1;
    
    // Use API privileges directly
    const apiPrivileges = svipData?.privileges || [];
    
    const currentPrivilege = apiPrivileges[selectedPrivilegeIndex] || null;
    const requirements = levelRequirements[level] || levelRequirements[1];

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0D0C' }]}>
                <ActivityIndicator size="large" color="#e6a978" />
            </View>
        );
    }

    // Format number helper (e.g. 180000000 -> 180,000,000)
    const formatNumber = (num) => {
        if (num === undefined || num === null) return "0";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Smooth T mapping: Level 1 (0) to Level 15 (1)
    const T = (level - 1) / 14;

    // Base Curve coordinates (P0, P1, P2) inside a 320x45 viewport
    const p0 = { x: 20, y: 15 };
    const p1 = { x: 160, y: 40 }; // Control point of background curve
    const p2 = { x: 300, y: 15 };

    // Split curve at T using de Casteljau's algorithm
    const bx = (1 - T) * (1 - T) * p0.x + 2 * (1 - T) * T * p1.x + T * T * p2.x;
    const by = (1 - T) * (1 - T) * p0.y + 2 * (1 - T) * T * p1.y + T * T * p2.y;

    const cpLeftX = (1 - T) * p0.x + T * p1.x;
    const cpLeftY = (1 - T) * p0.y + T * p1.y;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            {/* Background Image */}
            <Image
                source={require('../assets/BgChngeweb.webp')}
                style={[StyleSheet.absoluteFillObject, { width: '100%', height: '100%', resizeMode: 'cover' }]}
                resizeMode="cover"
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <ChevronLeft color="#fff" size={28} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SVIP</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => navigation.navigate('VIPScreen')} style={styles.iconBtn}>
                        <Text style={styles.vIcon}>V</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <List color="#fff" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    {/* Profile Info (Left) */}
                    <View style={styles.profileLeft}>
                        <View style={styles.avatarContainer}>
                            {avatar ? (
                                <Image source={avatar} style={styles.avatar} />
                            ) : (
                                <View style={styles.placeholderAvatar}>
                                    <Text style={styles.placeholderInitial}>{name.charAt(0)}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.userNameText} numberOfLines={1}>{name}</Text>
                        <Text style={styles.userStatusText}>You are not an SVIP yet</Text>
                    </View>

                    {/* Carousel / Badge (Right) */}
                    <View style={styles.profileRight}>
                        <Animated.FlatList
                            data={LEVELS}
                            keyExtractor={(item) => item.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            bounces={false}
                            renderItem={renderCarouselItem}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: true }
                            )}
                            onMomentumScrollEnd={(e) => {
                                const newIndex = Math.round(e.nativeEvent.contentOffset.x / BADGE_WIDTH);
                                setCurrentIndex(newIndex);
                            }}
                        />
                    </View>
                </View>

                {/* Level Indicator Section */}
                <View style={styles.levelIndicatorSection}>
                    <Text style={styles.levelTitle}>SVIP {level}</Text>

                    <View style={styles.progressBarContainer}>
                        <Svg width={width - 40} height={45} viewBox="0 0 320 45">
                            {/* Inactive Base Line (drawn fully in light transparent gold) */}
                            <Path
                                d="M 20 15 Q 160 40 300 15"
                                fill="none"
                                stroke="rgba(230, 169, 120, 0.15)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* Active Highlight Path (drawn on top up to bx,by) */}
                            {level > 1 && (
                                <Path
                                    d={`M 20 15 Q ${cpLeftX} ${cpLeftY} ${bx} ${by}`}
                                    fill="none"
                                    stroke="#e6a978"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                />
                            )}

                            {/* Left Diamond Node (SVIP 1) */}
                            <G>
                                <Polygon points="20,10 25,15 20,20 15,15" fill="#e6a978" />
                            </G>

                            {/* Right Diamond Node (SVIP 15) */}
                            <G>
                                <Polygon points="300,10 305,15 300,20 295,15" fill="rgba(230, 169, 120, 0.3)" />
                            </G>

                            {/* Center Active Diamond Node */}
                            <G>
                                {/* Outer glow */}
                                <Circle cx={bx} cy={by} r={10} fill="rgba(230, 169, 120, 0.25)" />
                                {/* Diamond border */}
                                <Polygon points={`${bx},${by - 8} ${bx + 8},${by} ${bx},${by + 8} ${bx - 8},${by}`} fill="#0F0D0C" stroke="#e6a978" strokeWidth="2" />
                                {/* Inner Diamond dot */}
                                <Polygon points={`${bx},${by - 4} ${bx + 4},${by} ${bx},${by + 4} ${bx - 4},${by}`} fill="#e6a978" />
                            </G>
                        </Svg>

                        {/* Labels underneath the curve */}
                        <View style={styles.curveLabelsRow}>
                            <Text style={styles.progressText}>{svipData?.previousLevelName || (level - 1 === 0 ? "0" : `SVIP ${level - 1}`)}</Text>
                            <View style={styles.rightLabelWrapper}>
                                <Text style={styles.progressText}>{svipData?.nextLevelName || `SVIP ${level < 15 ? level + 1 : 15}`}</Text>
                                <Info size={12} color="#a08b7d" style={{ marginLeft: 4 }} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Structured Requirements Card */}
                <View style={styles.requirementsCard}>
                    <Text style={styles.requirementsHeader}>SVIP {level} NEXT SVIP </Text>

                    {/* Requirement 1: Top Up */}
                   

                    {/* Requirement 2: Send Coins */}
                    <View style={styles.requirementItem}>
                        {/* <View style={styles.requirementLabelRow}>
                            <Text style={styles.requirementName}>Send Target</Text>
                            <Text style={styles.requirementProgress}>
                                <Text style={styles.highlightText}>💎 {formatNumber(requirements.send)}</Text>
                            </Text>
                        </View> */}
                        <View style={styles.requirementProgressBarBg}>
                            <View style={[styles.requirementProgressBarFill, { width: '0%', backgroundColor: '#77cbd3' }]} />
                        </View>
                    </View>

                    {/* Footer Info */}
                    <View style={styles.requirementFooter}>
                        <View style={styles.lockedBadge}>
                            <Text style={styles.lockedText}>{svipData?.svipBadgeLock ? svipData.svipBadgeLock.toUpperCase() : "LOCKED"}</Text>
                        </View>
                        <Text style={styles.requirementFooterText}>
                            {svipData?.svipBadgeMessage || "Complete targets to upgrade"}
                        </Text>
                    </View>
                </View>

                {/* Personal Privileges Card Section */}
                <View style={styles.privilegesCard}>
                    <View style={styles.benefitsTitleContainer}>
                        <LinearGradient colors={['#3F2E23', '#2B1C13']} style={styles.benefitsTitleWrapper}>
                            <Text style={styles.benefitsTitleText}>Personal Privileges</Text>
                        </LinearGradient>
                    </View>

                    <View style={styles.privilegeContentWrapper}>
                        {apiPrivileges.length > 0 ? (
                            <>
                                <View style={styles.largeIconContainer}>
                                    {/* Glow Effect 
                                    <View style={styles.iconGlow} />
                                    */}
                                    <IconImage 
                                        source={currentPrivilege?.privilegeBannerPath ? { uri: `https://landing.hostingsky.in/${currentPrivilege.privilegeBannerPath}` } : null} 
                                        style={styles.largePrivilegeIcon} 
                                        resizeMode="contain" 
                                    />
                                </View>

                                <View style={styles.privilegeTitleRow}>
                                    <Text style={styles.diamondDecor}>✦</Text>
                                    <Text style={styles.privilegeTitleText}>{currentPrivilege?.privilegeName || "Select Privilege"}</Text>
                                    <Text style={styles.diamondDecor}>✦</Text>
                                </View>

                                <Text style={styles.privilegeDescText}>{currentPrivilege?.description || ""}</Text>
                            </>
                        ) : (
                            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                                <Text style={[styles.privilegeTitleText, { color: '#e6a978', fontSize: 16 }]}>No Privileges Unlocked</Text>
                                <Text style={[styles.privilegeDescText, { textAlign: 'center', marginTop: 10, color: '#a08b7d' }]}>
                                    Upgrade to SVIP to unlock and enjoy exclusive benefits!
                                </Text>
                            </View>
                        )}
                    </View>

                    {apiPrivileges.length > 0 && (
                        <ScrollView 
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.smallIconsContainer}
                        >
                            {apiPrivileges.map((priv, idx) => {
                                const isActive = selectedPrivilegeIndex === idx;
                                return (
                                    <TouchableOpacity
                                        key={priv.privilegeMasterId.toString()}
                                        onPress={() => setSelectedPrivilegeIndex(idx)}
                                        style={styles.smallIconBtn}
                                    >
                                        <IconImage
                                            source={priv.privilegeBannerPath ? { uri: `https://landing.hostingsky.in/${priv.privilegeBannerPath}` } : null}
                                            style={[
                                                styles.smallIconImg,
                                                isActive && styles.activeSmallIconImg
                                            ]}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>

                {/* Bottom Spacer for Sticky Footer */}
                <View style={{ height: 20 }} />

            </ScrollView>

            {/* Sticky Bottom Footer */}
            {/* <View style={styles.stickyFooter}>
                <Text style={styles.footerText}>
                    Top up <Text style={styles.footerHighlight}>💎 {formatNumber(requirements.topUp)}</Text> more within 30 days to unlock SVIP {level}
                </Text>
                <TouchableOpacity style={styles.topUpBtn}>
                    <LinearGradient colors={['#fbdcb5', '#e6a978']} style={styles.topUpGradient}>
                        <Text style={styles.topUpBtnText}>Top Up</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 44,
        paddingBottom: 8,
        zIndex: 10,
    },
    iconBtn: {
        padding: 4,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vIcon: {
        color: '#e6a978',
        fontSize: 20,
        fontWeight: '900',
        marginRight: 10,
        fontStyle: 'italic',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    profileLeft: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: 1.2,
    },
    profileRight: {
        width: BADGE_WIDTH,
        height: 150,
        overflow: 'visible',
        marginTop: -70,
    },
    avatarContainer: {
        marginBottom: 10,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    placeholderAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#d97706',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderInitial: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userNameText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userStatusText: {
        color: '#a08b7d',
        fontSize: 12,
    },
    smallBadge: {
        width: 140,
        height: 100,
    },
    levelIndicatorSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 110,
    },
    levelTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        textShadowColor: 'rgba(230, 169, 120, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
        marginBottom: 2,
    },
    progressBarContainer: {
        width: '100%',
        alignItems: 'center',
    },
    curveLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 40,
        paddingHorizontal: 20,
        marginTop: 2,
    },
    rightLabelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressText: {
        color: '#a08b7d',
        fontSize: 11,
        fontWeight: '600',
    },
    requirementsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        marginHorizontal: 20,
        marginTop: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    requirementsHeader: {
        color: '#f5d6b3',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.4,
    },
    requirementItem: {
        marginBottom: 8,
    },
    requirementLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    requirementName: {
        color: '#a08b7d',
        fontSize: 11,
        fontWeight: '500',
    },
    requirementProgress: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    highlightText: {
        color: '#e6a978',
    },
    requirementProgressBarBg: {
        height: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2.5,
        overflow: 'hidden',
    },
    requirementProgressBarFill: {
        height: '100%',
        borderRadius: 2.5,
    },
    requirementFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    lockedBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
        marginRight: 8,
    },
    lockedText: {
        color: '#a08b7d',
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 0.4,
    },
    requirementFooterText: {
        color: '#a08b7d',
        fontSize: 10.5,
        flex: 1,
    },
    footerHighlightDays: {
        color: '#fff',
        fontWeight: 'bold',
    },
    privilegesCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        marginHorizontal: 20,
        marginTop: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
    },
    benefitsTitleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    benefitsTitleWrapper: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1.2,
        borderColor: '#e6a978',
    },
    benefitsTitleText: {
        color: '#f5d6b3',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    privilegeContentWrapper: {
        alignItems: 'center',
        width: '100%',
    },
    largeIconContainer: {
        width: 76,
        height: 76,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        position: 'relative',
        overflow: 'visible',
    },
    iconGlow: {
        position: 'absolute',
        width: 60,
        height: 60,
        backgroundColor: 'rgba(230, 169, 120, 0.08)',
        borderRadius: 30,
        shadowColor: '#e6a978',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 4,
    },
    largePrivilegeIcon: {
        width: 58,
        height: 58,
    },
    privilegeTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    diamondDecor: {
        color: '#e6a978',
        fontSize: 10,
        marginHorizontal: 4,
    },
    privilegeTitleText: {
        color: '#f5d6b3',
        fontSize: 13,
        fontWeight: 'bold',
    },
    privilegeDescText: {
        color: '#a08b7d',
        fontSize: 11,
        marginBottom: 12,
        textAlign: 'center',
        paddingHorizontal: 16,
        lineHeight: 15,
    },
    smallIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingHorizontal: 16,
        marginTop: 10,
        paddingBottom: 10,
    },
    smallIconBtn: {
        width: 46,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallIconImg: {
        width: 36,
        height: 36,
        opacity: 0.45,
    },
    activeSmallIconImg: {
        opacity: 1,
        transform: [{ scale: 1.18 }],
    },
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#15110E',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 14,
        borderTopWidth: 1,
        borderTopColor: 'rgba(230, 169, 120, 0.15)',
    },
    footerText: {
        color: '#a08b7d',
        fontSize: 11,
        lineHeight: 15,
        flex: 1,
        marginRight: 10,
    },
    footerHighlight: {
        color: '#e6a978',
        fontWeight: 'bold',
    },
    topUpBtn: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    topUpGradient: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topUpBtnText: {
        color: '#4a2c11',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
