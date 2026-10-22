import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, StatusBar, StyleSheet, ImageBackground, ActivityIndicator, Modal, Alert } from 'react-native';
import { ChevronLeft, MoreHorizontal, CheckCircle2, User, Trophy, FileText, Heart, Briefcase, Activity, MessageCircle, MapPin, Hash, Pencil, BookOpen, Home, Users, Star, Lock, Plus, Flower2, Share, Gift, MoreVertical, Shield, Copy } from 'lucide-react-native';
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import Clipboard from '@react-native-clipboard/clipboard';
import { setSelectedCover } from '../store/slices/authSlice';
import LinearGradient from "react-native-linear-gradient";
import apiService from '../services/apiService';

const { width, height } = Dimensions.get("window");

const CARDS = [
    // { id: 'cp', title: 'CP card', price: 18888, icon: Heart, iconColor: '#EF4444', colors: ['#FFF1F2', '#FFE4E6'], border: '#FDA4AF', iconFill: '#EF4444' },
    { id: 'soulmate', title: 'Soulmate card', price: 10000, icon: Users, iconColor: '#8B5CF6', colors: ['#F5F3FF', '#EDE9FE'], border: '#DDD6FE', iconFill: '#8B5CF6' },
    { id: 'bestie', title: 'Bestie card', price: 10000, icon: Star, iconColor: '#F59E0B', colors: ['#FEF3C7', '#FFFBEB'], border: '#FDE68A', iconFill: '#F59E0B' },
    { id: 'homie', title: 'Homie card', price: 10000, icon: Home, iconColor: '#10B981', colors: ['#ECFDF5', '#D1FAE5'], border: '#A7F3D0', iconFill: '#10B981' },
];

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const userId = useSelector((state) => state.auth.userId);

    const [activeTab, setActiveTab] = useState('About Me');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const selectedCover = useSelector((state) => state.auth.selectedCover);
    const [isRelUnlocked, setIsRelUnlocked] = useState(false);
    const [unlockModalVisible, setUnlockModalVisible] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [showAllianceCard, setShowAllianceCard] = useState(false);

    const fetchProfile = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const result = await apiService.get(`api/User/${userId}/profile`);
            if (result.success) {
                console.log('Profile Data fetched successfully:', result.data);
                setProfileData(result.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const albumUris = [];
    if (profileData?.albums && profileData.albums.length > 0) {
        profileData.albums.slice(0, 4).forEach(album => {
            const path = album.albumPath || "";
            const uri = path.startsWith('http') ? path : `https://landing.hostingsky.in${path}`;
            albumUris.push(uri);
        });
    }

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const coverSliderRef = useRef(null);

    const albumUrisRef = useRef(albumUris);
    useEffect(() => {
        albumUrisRef.current = albumUris;
    }, [albumUris]);

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProfile();
        });
        return unsubscribe;
    }, [navigation, userId]);

    // Sync index with persisted cover from Redux when profileData loads
    useEffect(() => {
        if (selectedCover && albumUris.length > 0) {
            const idx = albumUris.indexOf(selectedCover);
            if (idx !== -1) {
                setCurrentImageIndex(idx);
            }
        }
    }, [profileData, selectedCover]);

    // Slideshow: auto cycle every 5 seconds
    useEffect(() => {
        if (albumUris.length <= 1) return;

        const interval = setInterval(() => {
            const currentUris = albumUrisRef.current;
            if (currentUris.length <= 1) return;
            setCurrentImageIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % currentUris.length;
                if (coverSliderRef.current) {
                    coverSliderRef.current.scrollTo({ x: nextIndex * width, animated: true });
                }
                return nextIndex;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [albumUris.length]);

    // Dispatch cover change when index changes to avoid side effects during rendering
    useEffect(() => {
        if (albumUris.length > 0 && albumUris[currentImageIndex]) {
            dispatch(setSelectedCover(albumUris[currentImageIndex]));
        }
    }, [currentImageIndex, albumUris.length]);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const name = profileData?.name || "VENOM";
    const displayId = profileData?.profileId || "596042783";
    const avatarUri = profileData?.profilePictureUrl
        ? (profileData.profilePictureUrl.startsWith('http')
            ? profileData.profilePictureUrl
            : `https://landing.hostingsky.in${profileData.profilePictureUrl}`)
        : null;

    const renderRelationshipTab = () => {
        const MOCK_REL_CARDS = [
            { id: 1, name: 'Alice', type: 'Bestie', icon: '⭐', color: '#2563EB' },
            { id: 2, name: 'Bob', type: 'Homey', icon: '🏠', color: '#059669' },
            { id: 3, name: 'Charlie', type: 'Soulmate', icon: '💖', color: '#DC2626' },
            { id: 4, name: 'Diana', type: 'Bestie', icon: '⭐', color: '#2563EB' },
            { id: 5, name: 'Ethan', type: 'Homey', icon: '🏠', color: '#059669' },
            // Empty slots:
            { id: 6, empty: true },
            { id: 7, empty: true },
            { id: 8, empty: true },
            { id: 9, empty: true },
            { id: 10, empty: true },
            { id: 11, empty: true },
            { id: 12, empty: true },
            { id: 13, empty: true },
            { id: 14, empty: true },
            { id: 15, empty: true },
        ];

        // Resolve Left User data (Left ID & Left Image)
        const leftUserId = 
            profileData?.leftId || 
            profileData?.leftID || 
            profileData?.left_id || 
            profileData?.cpId || 
            profileData?.partnerId || 
            "ID";
            
        const rawLeftImage = 
            profileData?.leftImage || 
            profileData?.leftAvatar || 
            profileData?.leftProfilePictureUrl || 
            profileData?.left_image || 
            profileData?.left_avatar || 
            profileData?.left_profile_picture_url || 
            profileData?.cpAvatar || 
            profileData?.partnerAvatar || 
            null;
            
        const leftImageUri = rawLeftImage
            ? (rawLeftImage.startsWith('http') ? rawLeftImage : `https://landing.hostingsky.in${rawLeftImage}`)
            : null;

        // Resolve Main Friend (Right) User data (Right ID & Right Image)
        const mainFriendUserId = 
            profileData?.mainFriendId || 
            profileData?.mainFriendID || 
            profileData?.main_friend_id || 
            profileData?.mainFriendUserId || 
            profileData?.mainFriendUserID || 
            profileData?.main_friend_user_id || 
            profileData?.mainId || 
            profileData?.profileId || 
            "ID";
            
        const rawMainFriendImage = 
            profileData?.mainFriendImage || 
            profileData?.mainFriendAvatar || 
            profileData?.mainFriendProfilePictureUrl || 
            profileData?.main_friend_image || 
            profileData?.main_friend_avatar || 
            profileData?.main_friend_profile_picture || 
            profileData?.mainAvatar || 
            profileData?.profilePictureUrl || 
            null;
            
        const mainFriendImageUri = rawMainFriendImage
            ? (rawMainFriendImage.startsWith('http') ? rawMainFriendImage : `https://landing.hostingsky.in${rawMainFriendImage}`)
            : null;

        return (
            <View style={styles.relTabContainer}>
                {/* 1. Medal Card */}
                <View style={styles.relCard}>
                    {/* <Text style={styles.relCardTitle}>Medal</Text> */}

                    <View style={styles.medalAvatarRow}>
                        {/* Left ID User */}
                        <View style={styles.medalUserContainer}>
                            <View style={[styles.medalAvatarCircle, { backgroundColor: '#EAF2FF', overflow: 'hidden' }]}>
                                {mainFriendImageUri ? (
                                    <Image source={{ uri: mainFriendImageUri }} style={{ width: '100%', height: '100%', borderRadius: 24 }} />
                                ) : (
                                    <User color="#3b82f6" size={24} />
                                )}
                            </View>
                            <Text style={styles.medalUserId}>{mainFriendUserId}</Text>
                        </View>

                        {/* Center Heart with Star Badge */}
                        <View style={styles.medalCenterHeartWrapper}>
                            <Heart color="#FF5B7F" fill="#FF5B7F" size={60} />
                            <View style={styles.goldMedalStarBadge}>
                                <Text style={{ fontSize: 10 }}>⭐</Text>
                            </View>
                        </View>

                        {/* Right ID User */}
                        <View style={styles.medalUserContainer}>
                            <View style={[styles.medalAvatarCircle, { backgroundColor: '#FFEAF0', overflow: 'hidden' }]}>
                                {leftImageUri ? (
                                    <Image source={{ uri: leftImageUri }} style={{ width: '100%', height: '100%', borderRadius: 24 }} />
                                ) : (
                                    <User color="#FF5B7F" size={24} />
                                )}
                            </View>
                            <Text style={styles.medalUserId}>{leftUserId}</Text>
                        </View>
                    </View>

                    {/* Actions Grid */}
                    <View style={styles.medalActionsGrid}>
                        <TouchableOpacity style={styles.medalActionBtn}>
                            <View style={styles.medalActionIconCircle}>
                                <Heart color="#FF5B7F" size={20} />
                            </View>
                            <Text style={styles.medalActionLabel}>CP Like</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.medalActionBtn}>
                            <View style={styles.medalActionIconCircle}>
                                <View style={styles.ringIconBase}>
                                    <View style={styles.ringIconDiamond} />
                                </View>
                            </View>
                            <Text style={styles.medalActionLabel}>Ring Collection</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.medalActionBtn}>
                            <View style={styles.medalActionIconCircle}>
                                <Trophy color="#8B5CF6" size={20} />
                            </View>
                            <Text style={styles.medalActionLabel}>CP Ranking</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.medalActionBtn}>
                            <View style={styles.medalActionIconCircle}>
                                <Users color="#3B82F6" size={20} />
                            </View>
                            <Text style={styles.medalActionLabel}>CP Visitor</Text>
                        </TouchableOpacity>


                    </View>
                     <View style={styles.love}>
                    {/* <View style={styles.relHeaderRow}>
                        <Heart color="#FF5B7F" fill="#FF5B7F" size={16} style={{ marginRight: 6 }} />
                        <Text style={styles.relCardHeaderTitle}>Love</Text>
                    </View> */}

                    <View style={styles.loveCardsRow}>
                        {/* Love Story */}
                        <TouchableOpacity style={[styles.loveSubCard, { backgroundColor: '#FFF0F3' }]}>
                            <View style={[styles.loveIconCircle, { backgroundColor: '#FFE4E6' }]}>
                                <BookOpen color="#FF5B7F" size={18} />
                            </View>
                            <Text style={styles.loveSubTitle}>Love Story</Text>
                            <Text style={styles.loveSubDesc}>Read our journey</Text>
                        </TouchableOpacity>

                        {/* Love Home */}
                        <TouchableOpacity style={[styles.loveSubCard, { backgroundColor: '#F3E8FF' }]}>
                            <View style={[styles.loveIconCircle, { backgroundColor: '#E9D5FF' }]}>
                                <Home color="#8B5CF6" size={18} />
                            </View>
                            <Text style={styles.loveSubTitle}>Love Home</Text>
                            <Text style={styles.loveSubDesc}>Our special place</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>

                {/* 2. Love Card */}
               

                {/* 3. Relationships Card */}
                <View style={styles.relCard}>
                    <View style={[styles.relHeaderRow, { justifyContent: 'space-between', width: '100%' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Users color="#8B5CF6" size={18} style={{ marginRight: 6 }} />
                            <Text style={styles.relCardHeaderTitle}>Friends</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                        <View style={styles.relTypesRow}>
                            {/* Friend */}
                            <TouchableOpacity style={[styles.relTypeBtn, { borderColor: '#FEF3C7', backgroundColor: '#FFFBEB' }]}>
                                <Users color="#D97706" size={56} />
                                <Text style={[styles.relTypeLabel, { color: '#B45309' }]}>Friend</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.relTypeBtn, { borderColor: '#FEF3C7', backgroundColor: '#FFFBEB' }]}>
                                <Users color="#D97706" size={56} />
                                <Text style={[styles.relTypeLabel, { color: '#B45309' }]}>Friend</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.relTypeBtn, { borderColor: '#FEF3C7', backgroundColor: '#FFFBEB' }]}>
                                <Users color="#D97706" size={56} />
                                <Text style={[styles.relTypeLabel, { color: '#B45309' }]}>Friend</Text>
                            </TouchableOpacity>

                            {/* Unlock Button styled exactly like the others */}
                            {!isRelUnlocked && (
                                <TouchableOpacity
                                    style={[styles.relTypeBtn, { borderColor: '#DBEAFE', backgroundColor: '#EFF6FF' }]}
                                    onPress={() => setUnlockModalVisible(true)}
                                    activeOpacity={0.8}
                                >
                                    <Lock color="#2563EB" size={56} />
                                    <Text style={[styles.relTypeLabel, { color: '#1D4ED8' }]}>Unlock</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                    {/* Unlocked vertical slots list */}
                    {isRelUnlocked && (
                        <View style={styles.unlockedVerticalList}>
                            {MOCK_REL_CARDS.map((card) => {
                                if (card.empty) {
                                    return (
                                        <TouchableOpacity key={card.id} style={styles.verticalEmptySlotCard} activeOpacity={0.85}>
                                            <Text style={styles.verticalPlusSign}>+</Text>
                                            <Text style={styles.verticalAddSlotLabel}>Add Slot</Text>
                                        </TouchableOpacity>
                                    );
                                }
                                return (
                                    <View key={card.id} style={styles.verticalFilledSlotCard}>
                                        <Text style={styles.verticalSlotName}>{card.name}</Text>
                                        <View style={[styles.verticalSlotStrip, { backgroundColor: card.color + '15' }]}>
                                            <Text style={[styles.verticalSlotBadgeText, { color: card.color }]}>
                                                {card.icon} {card.type}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderAllianceTab = () => {
        return (
            <View style={[styles.relTabContainer, { paddingTop: 20 }]}>
                <View style={[styles.allianceCardContainer, { alignSelf: 'center', marginVertical: 8, width: '100%' }]}>
                    <View style={styles.allianceCardContent}>
                        <View style={styles.allianceShieldWrapper}>
                            <LinearGradient
                                colors={['#60A5FA', '#2563EB']}
                                style={styles.allianceShieldCircle}
                            >
                                <Shield color="#FFFFFF" size={20} fill="#3B82F6" />
                                <View style={styles.shieldSilhouetteOverlay}>
                                    <Users color="#3B82F6" size={8} />
                                </View>
                            </LinearGradient>
                        </View>

                        <View style={styles.allianceTextCol}>
                            <Text style={styles.allianceCardTitle}>
                                Go join the  Clan and get your reward
                            </Text>
                        </View>

                        <TouchableOpacity 
                            style={styles.allianceJoinBtn}
                            onPress={() => {
                                navigation.navigate('FamilySquareScreen');
                            }}
                        >
                            <LinearGradient
                                colors={['#FCD34D', '#F59E0B']}
                                style={styles.allianceJoinBtnGradient}
                            >
                                <Text style={styles.allianceJoinBtnText}>Join</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Second Identical Card */}
                <View style={[styles.allianceCardContainer, { alignSelf: 'center', marginVertical: 8, width: '100%' }]}>
                    <View style={styles.allianceCardContent}>
                        <View style={styles.allianceShieldWrapper}>
                            <LinearGradient
                                colors={['#60A5FA', '#2563EB']}
                                style={styles.allianceShieldCircle}
                            >
                                <Shield color="#FFFFFF" size={20} fill="#3B82F6" />
                                <View style={styles.shieldSilhouetteOverlay}>
                                    <Users color="#3B82F6" size={8} />
                                </View>
                            </LinearGradient>
                        </View>

                        <View style={styles.allianceTextCol}>
                            <Text style={styles.allianceCardTitle}>
                                Go join the Square  and get your reward
                            </Text>
                        </View>

                        <TouchableOpacity 
                            style={styles.allianceJoinBtn}
                            onPress={() => {
                                navigation.navigate('FamilySquareScreen');
                            }}
                        >
                            <LinearGradient
                                colors={['#FCD34D', '#F59E0B']}
                                style={styles.allianceJoinBtnGradient}
                            >
                                <Text style={styles.allianceJoinBtnText}>Join</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderMintTab = () => {
        const MINT_POSTS = [
            {
                id: '1',
                user: {
                    name: 'shanaya',
                    avatar: require('../assets/av1.jpg'),
                    time: '2 h ago',
                    level: 'LV.4',
                    vip: 'SVIP 1',
                },
                topic: 'Good Vibe',
                text: 'Main chanchal hu thodi\npar\nWo sabar rakhata hai\nWo shaq nii karta\nBas mere achche bure ki khabar rakhata hai\nAur main har vakt apni harkto se pareshan karti rahti hu ...',
                image: require('../assets/grid1.jpg'),
                stats: {
                    shares: 0,
                    comments: 22,
                    likes: 26,
                    gifts: '755.64K'
                }
            }
        ];

        return (
            <View style={{ paddingVertical: 12, paddingHorizontal: 0 }}>
                {MINT_POSTS.map((item) => (
                    <View key={item.id} style={styles.mintPostCard}>
                        {/* Post Header */}
                        <View style={styles.mintPostHeader}>
                            <Image source={item.user.avatar} style={styles.mintAvatar} />
                            <View style={styles.mintUserInfo}>
                                <View style={styles.mintNameRow}>
                                    <Text style={styles.mintUserName}>{item.user.name}</Text>
                                    <View style={styles.mintVipBadge}>
                                        <Text style={styles.mintBadgeText}>{item.user.vip}</Text>
                                    </View>
                                    <View style={styles.mintLevelBadge}>
                                        <Text style={styles.mintBadgeText}>{item.user.level}</Text>
                                    </View>
                                </View>
                                <Text style={styles.mintTimeText}>{item.user.time} • 🌎</Text>
                            </View>
                            
                            <TouchableOpacity style={styles.mintFollowButton}>
                                <Text style={styles.mintFollowText}>Follow</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={{ padding: 5 }}>
                                <MoreVertical color="#9ca3af" size={20} />
                            </TouchableOpacity>
                        </View>

                        {/* Topic Pill */}
                        {item.topic && (
                            <View style={styles.mintTopicPill}>
                                <Hash color="#0F8F6F" size={12} />
                                <Text style={styles.mintTopicText}>{item.topic} {'>'}</Text>
                            </View>
                        )}

                        {/* Post Content */}
                        <Text style={styles.mintPostText}>
                            {item.text}
                            <Text style={styles.mintMoreText}> More</Text>
                        </Text>

                        {/* Post Image */}
                        {item.image && (
                            <Image source={item.image} style={styles.mintPostImage} />
                        )}

                        {/* Post Actions */}
                        <View style={styles.mintActionRow}>
                            <TouchableOpacity style={styles.mintActionBtn}>
                                <Share color="#9ca3af" size={20} />
                            </TouchableOpacity>
                            
                            <View style={styles.mintRightActions}>
                                <TouchableOpacity style={styles.mintActionBtn}>
                                    <MessageCircle color="#9ca3af" size={20} />
                                    <Text style={styles.mintActionText}>{item.stats.comments}</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={styles.mintActionBtn}>
                                    <Heart color="#9ca3af" size={20} />
                                    <Text style={styles.mintActionText}>{item.stats.likes}</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={styles.mintActionBtn}>
                                    <Gift color="#9ca3af" size={20} />
                                    <Text style={styles.mintActionText}>{item.stats.gifts}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    const renderHonorTab = () => {
        return (
            <View style={{ paddingVertical: 12, paddingHorizontal: 0 }}>
                {/* Gift Showcase */}
                <ShowcaseSection 
                    title="Gift Showcase" 
                    count="0" 
                    themeColor="#8b5cf6" 
                    themeBg="#1e1b4b"
                    items={[
                        { image: { uri: 'https://img.icons8.com/nolan/96/gift.png' } },
                        { image: { uri: 'https://img.icons8.com/nolan/96/gift.png' } },
                        { image: { uri: 'https://img.icons8.com/nolan/96/gift.png' } },
                        { image: { uri: 'https://img.icons8.com/nolan/96/gift.png' } },
                        { image: { uri: 'https://img.icons8.com/nolan/96/gift.png' } },
                        { image: { uri: 'https://img.icons8.com/nolan/96/gift.png' } },
                    ]}
                />

                {/* Enter Showcase */}
                <ShowcaseSection 
                    title="Enter Showcase" 
                    count="1" 
                    themeColor="#b45309" 
                    themeBg="#271404"
                    items={[
                        { image: require('../assets/35- Exclusive Entry.png') }, 
                        null, null, null, null, null
                    ]}
                />

                {/* Frame Showcase */}
                <ShowcaseSection 
                    title="Frame Showcase" 
                    count="1" 
                    themeColor="#1d4ed8" 
                    themeBg="#070e20"
                    items={[
                        { image: require('../assets/34- Room SVIP Frame.png') },
                        null, null, null, null, null
                    ]}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                {/* 1. Cover Image Slider & Header */}
                <View style={[styles.coverImage, { overflow: 'hidden' }]}>
                    <ScrollView
                        ref={coverSliderRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(event.nativeEvent.contentOffset.x / width);
                            setCurrentImageIndex(index);
                        }}
                    >
                        {profileData?.albums && profileData.albums.length > 0 ? (
                            profileData.albums.map((album, index) => {
                                const path = album.albumPath || "";
                                const uri = path.startsWith('http') ? path : `https://landing.hostingsky.in${path}`;
                                return (
                                    <ImageBackground
                                        key={index}
                                        source={{ uri }}
                                        style={[styles.coverImage]}
                                        resizeMode="cover"
                                    >
                                    <LinearGradient
                                        colors={['rgba(0,0,0,0.4)', 'transparent']}
                                        style={styles.coverGradient}
                                    />
                                    </ImageBackground>
                                );
                            })
                        ) : (
                            <ImageBackground
                                source={require('../assets/profile_banner.jpg')}
                                style={[styles.coverImage]}
                                resizeMode="cover"
                            >
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.4)', 'transparent']}
                                    style={styles.coverGradient}
                                />
                            </ImageBackground>
                        )}
                    </ScrollView>

                    {/* Header Icons - absolute positioned to stay visible while sliding */}
                    <View style={[styles.headerRow, { position: 'absolute', top: 0, width: '100%', zIndex: 10 }]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                            <ChevronLeft color="#fff" size={28} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('ProfileEditScreen')}>
                            <Pencil color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content Area - Dark Navy Background */}
                <View style={styles.contentContainer}>

                    {/* 2. Avatar & Mini Gallery */}
                    <View style={styles.avatarRow}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={avatarUri ? { uri: avatarUri } : require('../assets/av1.jpg')}
                                style={styles.avatar}
                            />
                        </View>

                        <View style={styles.galleryWrapper}>
                            {profileData?.albums && profileData.albums.length > 0 ? (
                                profileData.albums.slice(0, 4).map((album, index) => {
                                    const path = album.albumPath || "";
                                    const uri = path.startsWith('http') ? path : `https://landing.hostingsky.in${path}`;
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                dispatch(setSelectedCover(uri));
                                                setCurrentImageIndex(index);
                                            }}
                                            activeOpacity={0.85}
                                        >
                                            <Image
                                                source={{ uri }}
                                                style={styles.miniPhoto}
                                            />
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                [1, 2, 3, 4].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            dispatch(setSelectedCover(null));
                                            setCurrentImageIndex(index);
                                        }}
                                        activeOpacity={0.85}
                                    >
                                        <Image
                                            source={require('../assets/av1.jpg')}
                                            style={styles.miniPhoto}
                                        />
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    </View>

                    {/* 3. Name & Identity Row */}
                    <View style={[styles.nameRow, { justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.nameText}>{name}</Text>
                            <CheckCircle2 color="#3b82f6" fill="#fff" size={18} style={{ marginLeft: 4 }} />
                        </View>
                    </View>

                    <View style={styles.idRow}>
                        <Text style={styles.idText}>ID:{displayId}</Text>
                        <TouchableOpacity 
                            style={{ marginLeft: 4 }} 
                            onPress={() => {
                                Clipboard.setString(displayId.toString());
                                Alert.alert("Copied", "ID copied to clipboard!");
                            }}
                        >
                            <Copy color="#9ca3af" size={14} />
                        </TouchableOpacity>
                        <Text style={styles.idDot}> • </Text>
                        <View style={styles.onlineDot} />
                        <Text style={styles.onlineText}>Online</Text>
                        <MapPin color="#22c55e" size={12} style={{ marginLeft: 8, marginRight: 2 }} />
                        <Text style={styles.onlineText}>{profileData?.countryName || 'India'}-{profileData?.cityName || 'Chennai'}</Text>
                    </View>

                    <View style={styles.badgesRow}>
                        {/* Gender Icon */}
                        <View style={{ backgroundColor: profileData?.gender === 'Male' ? '#3b82f6' : '#ec4899', width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 8, marginTop: -2 }}>{profileData?.gender === 'Male' ? '♂' : '♀'}</Text>
                        </View>
                        {/* Blue Shield */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#4338ca', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8 }}>
                            <Image source={{ uri: 'https://img.icons8.com/fluency/48/shield.png' }} style={{ width: 10, height: 10, marginRight: 4 }} />
                            <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>36</Text>
                        </View>
                        {/* Pink Diamond */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#a21caf', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8 }}>
                            <Image source={{ uri: 'https://img.icons8.com/color/48/diamond.png' }} style={{ width: 10, height: 10, marginRight: 4 }} />
                            <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>7</Text>
                        </View>
                        {/* India Flag */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8 }}>
                            <Text style={{ fontSize: 9, marginRight: 4 }}>🇮🇳</Text>
                            <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>{profileData?.countryName || 'India'}</Text>
                        </View>
                        {/* SVIP6 */}
                        <TouchableOpacity onPress={() => navigation.navigate('SVIPScreen')}>
                            <LinearGradient colors={['#f59e0b', '#d97706']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8 }}>
                                <Image source={{ uri: 'https://img.icons8.com/color/48/warranty.png' }} style={{ width: 10, height: 10, marginRight: 4 }} />
                                <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>SVIP6</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        {/* Agency */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8 }}>
                            <Image source={{ uri: 'https://img.icons8.com/color/48/connection-to-account.png' }} style={{ width: 10, height: 10, marginRight: 4 }} />
                            <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>Agency</Text>
                        </View>
                    </View>

                    {/* 4. Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{profileData?.friends || 0}</Text>
                            <Text style={styles.statLabel}>Friends</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{profileData?.following || 0}</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{profileData?.followers || 0}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{profileData?.visitors || 0}</Text>
                            <Text style={styles.statLabel}>Visitors</Text>
                        </View>
                    </View>

                    {/* Medals Row */}
                    <View style={styles.medalsRow}>
                        {[1, 2, 3, 4, 5].map((_, index) => (
                            <Image 
                                key={index}
                                source={{ uri: 'https://img.icons8.com/color/48/warranty.png' }} 
                                style={styles.medalIcon} 
                            />
                        ))}
                    </View>

                    {/* 5. Custom Tab Bar */}
                    <View style={styles.tabContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                            <TabItem icon={User} label="About Me" active={activeTab === 'About Me'} onPress={() => setActiveTab('About Me')} />
                            <TabItem icon={Heart} label="Relationship" active={activeTab === 'Relationship'} onPress={() => setActiveTab('Relationship')} />
                            <TabItem icon={Shield} label="Alliance" active={activeTab === 'Alliance'} onPress={() => setActiveTab('Alliance')} />
                            <TabItem icon={Trophy} label="Honor" active={activeTab === 'Honor'} onPress={() => setActiveTab('Honor')} />
                            <TabItem icon={Flower2} label="Mint" active={activeTab === 'Moments'} onPress={() => setActiveTab('Moments')} badge={20} />
                        </ScrollView>
                    </View>

                    <View style={styles.tabDivider} />

                    {/* 6. Tab Content */}
                    {activeTab === 'About Me' && (
                        <View style={styles.tabContent}>

                            {/* Bio */}
                            <Text style={styles.sectionTitle}>Bio</Text>
                            <Text style={styles.bioText}>{profileData?.bio || "Born to express, not to impress"}</Text>
                            <View style={styles.contentDivider} />

                            {/* Basic Information */}
                            <Text style={styles.sectionTitle}>Basic information</Text>
                            <View style={styles.pillsContainer}>
                                <InfoPill icon={Activity} label={profileData ? `${profileData.height}${profileData.heightUnit}` : "176cm"} />
                                <InfoPill icon={MapPin} label={profileData ? `${profileData.weight}${profileData.weightUnit}` : "75kg"} />
                                <InfoPill icon={Heart} label={profileData?.relation || "Married"} />
                                <InfoPill icon={Briefcase} label={profileData?.occupationName || "Accountant"} />
                                <InfoPill icon={MessageCircle} label={profileData?.languageName || "Gujarati"} />
                            </View>
                            <View style={styles.contentDivider} />

                            {/* Hobbies */}
                            <Text style={styles.sectionTitle}>Hobbies</Text>
                            <View style={styles.pillsContainer}>
                                {profileData?.hobbies?.length > 0 ? (
                                    profileData.hobbies.map((hobby, idx) => (
                                        <EmojiPill key={idx} emoji={hobby.hobbyIcon} label={hobby.hobbyName} />
                                    ))
                                ) : (
                                    <>
                                        <EmojiPill emoji="🏏" label="Cricket" />
                                        <EmojiPill emoji="🌱" label="Vegetarian" />
                                        <EmojiPill emoji="🍵" label="Tea" />
                                        <EmojiPill emoji="🎾" label="Tennis" />
                                        <EmojiPill emoji="🏀" label="Basketball" />
                                        <EmojiPill emoji="🧘‍♂️" label="Yoga" />
                                    </>
                                )}
                            </View>

                        </View>
                    )}

                    {activeTab === 'Relationship' && renderRelationshipTab()}
                    {activeTab === 'Alliance' && renderAllianceTab()}
                    {activeTab === 'Honor' && renderHonorTab()}
                    {activeTab === 'Moments' && renderMintTab()}

                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={unlockModalVisible}
                onRequestClose={() => setUnlockModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Unlock Relationship Card</Text>
                            <TouchableOpacity onPress={() => setUnlockModalVisible(false)} style={styles.modalCloseBtn}>
                                <Text style={styles.modalCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Cards Grid */}
                        <View style={styles.modalCardsGrid}>
                            {CARDS.map((card) => {
                                const CardIcon = card.icon;
                                const isSelected = selectedCardId === card.id;
                                return (
                                    <TouchableOpacity
                                        key={card.id}
                                        style={[
                                            styles.cardItemContainer,
                                            isSelected && styles.cardItemContainerSelected
                                        ]}
                                        onPress={() => setSelectedCardId(card.id)}
                                        activeOpacity={0.9}
                                    >
                                        {/* Card Shape */}
                                        <View style={[styles.premiumCardShape, { borderColor: card.border }]}>
                                            <LinearGradient
                                                colors={card.colors}
                                                style={styles.premiumCardGradient}
                                            >
                                                {/* Inner border */}
                                                <View style={[styles.premiumCardInnerBorder, { borderColor: card.border + '50' }]}>
                                                    <CardIcon color={card.iconColor} fill={card.iconFill} size={36} />
                                                </View>
                                            </LinearGradient>
                                        </View>

                                        {/* Card Title */}
                                        <Text style={styles.premiumCardTitleText}>{card.title}</Text>

                                        {/* Coin Price */}
                                        <View style={styles.priceContainer}>
                                            <View style={styles.coinCircle}>
                                                <Text style={styles.coinSymbol}>$</Text>
                                            </View>
                                            <Text style={styles.priceText}>{card.price}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Action Button */}
                        <TouchableOpacity
                            style={[
                                styles.modalPurchaseBtn,
                                !selectedCardId && styles.modalPurchaseBtnDisabled
                            ]}
                            disabled={!selectedCardId}
                            onPress={() => {
                                setUnlockModalVisible(false);
                                setIsRelUnlocked(true);
                                Alert.alert("Success", `Successfully unlocked ${CARDS.find(c => c.id === selectedCardId)?.title}!`);
                            }}
                        >
                            <Text style={styles.modalPurchaseBtnText}>Unlock Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const ShowcaseSection = ({ title, count, themeColor, themeBg, items }) => (
    <View style={{ marginBottom: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }}>{title}</Text>
            <Text style={{ color: '#B8C1D1', fontSize: 11 }}>{count} {'>'}</Text>
        </View>
        
        {/* Shelf */}
        <View style={{ 
            backgroundColor: themeBg, 
            borderWidth: 1, 
            borderColor: themeColor + '80', 
            borderRadius: 8,
            overflow: 'hidden' 
        }}>
            {/* Top Border Highlight */}
            <View style={{ height: 2, backgroundColor: themeColor }} />
            
            {/* Row 1 */}
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: themeColor + '80' }}>
                <ShelfSlot item={items[0]} themeColor={themeColor} hasRightBorder />
                <ShelfSlot item={items[1]} themeColor={themeColor} hasRightBorder />
                <ShelfSlot item={items[2]} themeColor={themeColor} />
            </View>
            
            {/* Row 2 */}
            <View style={{ flexDirection: 'row' }}>
                <ShelfSlot item={items[3]} themeColor={themeColor} hasRightBorder />
                <ShelfSlot item={items[4]} themeColor={themeColor} hasRightBorder />
                <ShelfSlot item={items[5]} themeColor={themeColor} />
            </View>
            
            {/* Bottom Border Highlight */}
            <View style={{ height: 4, backgroundColor: themeColor }} />
        </View>
    </View>
);

const ShelfSlot = ({ item, themeColor, hasRightBorder }) => (
    <View style={{ 
        flex: 1, 
        height: 100, 
        borderRightWidth: hasRightBorder ? 1 : 0, 
        borderRightColor: themeColor + '80',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: themeColor + '10' 
    }}>
        {/* 3D Base Platform */}
        <View style={{ 
            position: 'absolute', 
            bottom: 5, 
            width: '80%', 
            height: 14, 
            borderRadius: 7, 
            backgroundColor: themeColor, 
            opacity: 0.25,
            transform: [{ scaleY: 0.5 }] 
        }} />
        
        {/* Item or Empty Icon */}
        {item ? (
            <Image source={item.image} style={{ width: 50, height: 50, resizeMode: 'contain', bottom: 5 }} />
        ) : (
            <View style={{ opacity: 0.15, bottom: 5 }}>
                <Flower2 color={themeColor} size={28} />
            </View>
        )}
    </View>
);

// Reusable Components
const TabItem = ({ icon: Icon, label, active, onPress, badge }) => (
    <TouchableOpacity style={[styles.tabItem, active && styles.activeTabItem]} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon color={active ? '#fff' : '#9ca3af'} size={16} style={{ marginRight: 6 }} />
            <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
            {badge !== undefined && (
                <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{badge}</Text>
                </View>
            )}
        </View>
        {active && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
);

const InfoPill = ({ icon: Icon, label }) => (
    <View style={styles.pill}>
        <Icon color="#9ca3af" size={12} style={{ marginRight: 4 }} />
        <Text style={styles.pillText}>{label}</Text>
    </View>
);

const EmojiPill = ({ emoji, label }) => (
    <View style={styles.pill}>
        <Text style={{ fontSize: 11, marginRight: 4 }}>{emoji}</Text>
        <Text style={styles.pillText}>{label}</Text>
    </View>
);


// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1424', // Dark Navy theme
    },
    coverImage: {
        width: width,
        height: height * 0.35, 
    },
    coverGradient: {
        flex: 1,
        justifyContent: 'space-between',
    },
    love:{
marginTop:15
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 26,
        paddingTop: 50, // For status bar
    },
    headerIcon: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#0D1424',
        marginTop: 0,
        paddingHorizontal: 16,
    },
    avatarRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -34,
    },
    avatarWrapper: {
        width: 68,
        height: 68,
        borderRadius: 34,
        borderWidth: 0,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    galleryWrapper: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 0,
    },
    miniPhoto: {
        width: 42,
        height: 42,
        borderRadius: 6,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    nameText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    idRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    idText: {
        color: '#B8C1D1',
        fontSize: 12,
    },
    idDot: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        marginHorizontal: 4,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22C55E', // Green
        marginRight: 4,
    },
    onlineText: {
        color: '#B8C1D1',
        fontSize: 12,
    },
    badgesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 6,
    },
    blueBadge: {
        backgroundColor: '#1d4ed8',
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unknownBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    unknownBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    statNumber: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 4,
    },
    statLabel: {
        color: '#B8C1D1',
        fontSize: 12,
    },
    medalsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
        paddingLeft: 2,
    },
    medalIcon: {
        width: 24,
        height: 24,
    },
    tabContainer: {
        marginTop: 8,
    },
    tabScroll: {
        paddingRight: 20,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        height: 44,
        justifyContent: 'center',
        position: 'relative',
    },
    activeTabItem: {
        // Active specific styles if needed
    },
    tabLabel: {
        color: '#B8C1D1',
        fontSize: 13,
        fontWeight: '600',
    },
    activeTabLabel: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#3A82F7',
        borderRadius: 2,
    },
    tabBadge: {
        backgroundColor: '#ef4444',
        borderRadius: 9,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
        paddingHorizontal: 4,
    },
    tabBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tabDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginTop: 0,
    },
    tabContent: {
        paddingTop: 12,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    bioText: {
        color: '#B8C1D1',
        fontSize: 13,
        lineHeight: 18,
    },
    contentDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 10,
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 16,
        paddingHorizontal: 10,
        height: 32,
    },
    pillText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    relTabContainer: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    relCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FFE4E6',
        marginBottom: 16,
        shadowColor: '#FDA4AF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    relCardTitle: {
        color: '#1E293B',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    medalAvatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        marginVertical: 10,
    },
    medalUserContainer: {
        alignItems: 'center',
    },
    medalAvatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    medalUserId: {
        color: '#64748B',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 6,
    },
    medalCenterHeartWrapper: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
    },
    goldMedalStarBadge: {
        position: 'absolute',
        top: -4,
        alignSelf: 'center',
        backgroundColor: '#F59E0B',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    medalActionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 16,
    },
    medalActionBtn: {
        alignItems: 'center',
        flex: 1,
    },
    medalActionIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF0F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    medalActionLabel: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
    ringIconBase: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    ringIconDiamond: {
        width: 6,
        height: 6,
        backgroundColor: '#3B82F6',
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: -4,
    },
    relHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    relCardHeaderTitle: {
        color: '#1E293B',
        fontSize: 14,
        fontWeight: 'bold',
    },
    loveCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    loveSubCard: {
        flex: 1,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    loveIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    loveSubTitle: {
        color: '#1E293B',
        fontSize: 12,
        fontWeight: 'bold',
    },
    loveSubDesc: {
        color: '#64748B',
        fontSize: 9,
        marginTop: 2,
    },
    viewAllText: {
        color: '#8B5CF6',
        fontSize: 11,
        fontWeight: '600',
    },
    relTypesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
    },
    relTypeBtn: {
        width: (width - 64 - 16) / 3, 
        height: 145,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 16,
        alignItems: 'center',
        gap: 8,
    },
    relTypeLabel: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    unlockedVerticalList: {
        marginTop: 16,
        gap: 14,
    },
    verticalEmptySlotCard: {
        width: '100%',
        alignItems: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    verticalPlusSign: {
        color: '#94A3B8',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 2,
    },
    verticalAddSlotLabel: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '600',
    },
    verticalFilledSlotCard: {
        width: '100%',
        alignItems: 'flex-start',
        paddingVertical: 4,
    },
    verticalSlotName: {
        color: '#1E293B',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 6,
        paddingLeft: 4,
    },
    verticalSlotStrip: {
        width: '100%',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    verticalSlotBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    mintPostCard: {
        backgroundColor: '#0a0a0aff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        width:'100%'
    },
    mintPostHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    mintAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    mintUserInfo: {
        flex: 1,
        marginLeft: 12,
    },
    mintNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    mintUserName: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 6,
    },
    mintVipBadge: {
        backgroundColor: '#F59E0B',
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 1,
        marginRight: 6,
    },
    mintLevelBadge: {
        backgroundColor: '#EF4444',
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 1,
    },
    mintBadgeText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    mintTimeText: {
        color: '#B8B8B8',
        fontSize: 11,
    },
    mintFollowButton: {
        borderWidth: 1,
        borderColor: '#0F8F6F',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginRight: 0,
        marginLeft :10
    },
    mintFollowText: {
        color: '#0F8F6F',
        fontSize: 12,
        fontWeight: 'bold',
    },
    mintTopicPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 143, 111, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 10,
    },
    mintTopicText: {
        color: '#0F8F6F',
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    mintPostText: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    mintMoreText: {
        color: '#0F8F6F',
        fontWeight: 'bold',
    },
    mintPostImage: {
        width: '100%',
        height: 380,
        borderRadius: 12,
        marginBottom: 12,
        resizeMode: 'cover',
    },
    mintActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: 12,
    },
    mintRightActions: {
        flexDirection: 'row',
        gap: 16,
    },
    mintActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    mintActionText: {
        color: '#B8B8B8',
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    modalCloseBtn: {
        padding: 4,
    },
    modalCloseText: {
        fontSize: 18,
        color: '#94A3B8',
        fontWeight: 'bold',
    },
    modalCardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
        marginBottom: 16,
    },
    cardItemContainer: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 16,
        padding: 4,
    },
    cardItemContainerSelected: {
        borderColor: '#8B5CF6',
        backgroundColor: '#F5F3FF',
    },
    premiumCardShape: {
        width: 90,
        height: 115,
        borderRadius: 14,
        borderWidth: 3,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    premiumCardGradient: {
        flex: 1,
        padding: 6,
    },
    premiumCardInnerBorder: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 8,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    premiumCardTitleText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#334155',
        marginTop: 6,
        textAlign: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    coinCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    coinSymbol: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
    priceText: {
        color: '#F59E0B',
        fontSize: 11,
        fontWeight: 'bold',
    },
    modalPurchaseBtn: {
        backgroundColor: '#8B5CF6',
        borderRadius: 14,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    modalPurchaseBtnDisabled: {
        backgroundColor: '#CBD5E1',
    },
    modalPurchaseBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    allianceHeaderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.2)',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginLeft: 10,
        justifyContent: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    allianceHeaderBtnText: {
        color: '#8B5CF6',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
    allianceCardContainer: {
        backgroundColor: '#E2EDF9',
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 12,
        width: '94%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    allianceArrowBtn: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    allianceCardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    allianceShieldWrapper: {
        marginRight: 8,
    },
    allianceShieldCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    shieldSilhouetteOverlay: {
        position: 'absolute',
        bottom: 4,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        padding: 1.5,
    },
    allianceTextCol: {
        flex: 1,
        marginRight: 8,
    },
    allianceCardTitle: {
        color: '#1E3A8A',
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 15,
    },
    allianceJoinBtn: {
        width: 70,
        height: 30,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    allianceJoinBtnGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    allianceJoinBtnText: {
        color: '#6B3E00',
        fontSize: 12,
        fontWeight: 'bold',
    }
});
