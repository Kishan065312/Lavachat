import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    TextInput,
    Alert,
    Platform,
    StatusBar,
    Animated,
    ImageBackground,
    Modal
} from 'react-native';
import { ChevronLeft, HelpCircle, Search, Plus, X, Heart, Sparkles, Gem, Crown, Award, Gift, BookOpen, MoreHorizontal, Pencil, Shirt } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const DUMMY_FRIENDS = [
    { id: '1', name: '√P🖤', displayId: '80004', hasBadge: true, gender: 'male', flag: '🇮🇳', isOnline: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: '2', name: 'Mikak...', displayId: '596042781', hasBadge: true, gender: 'female', flag: '🇬🇧', isOnline: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: '3', name: 'Hsd', displayId: '103405998', hasBadge: false, gender: 'male', flag: '🇮🇳', isOnline: true, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150' },
    { id: '4', name: 'HÄRŞH', displayId: '596042782', hasBadge: true, gender: 'male', flag: '🇮🇳', isOnline: true, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    { id: '5', name: '☄️MrFūnký🍵', displayId: '102979863', hasBadge: false, gender: 'male', flag: '🇮🇳', isOnline: false, avatar: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150' }
];

export default function CPSpaceScreen() {
    const navigation = useNavigation();
    const profile = useSelector((state) => state.auth.profile);
    const [searchQuery, setSearchQuery] = useState("");
    const [friends, setFriends] = useState(DUMMY_FRIENDS);
    const [addCPModalVisible, setAddCPModalVisible] = useState(false);
    const [modalSearchQuery, setModalSearchQuery] = useState("");

    // Dual-state control: Bind partner to toggle CP Nest
    const [isBound, setIsBound] = useState(false);
    const [partner, setPartner] = useState(null);

    const [aboutVisible, setAboutVisible] = useState(false);
    const [privilegeVisible, setPrivilegeVisible] = useState(false);

    // CP Nest background picker
    const [nestBgModalVisible, setNestBgModalVisible] = useState(false);
    const [nestBackground, setNestBackground] = useState('https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=600&auto=format&fit=crop');

    const NEST_THEMES = [
        { id: 1, uri: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=600&auto=format&fit=crop' },
        { id: 2, uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop' },
        { id: 3, uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600' },
        { id: 4, uri: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=600' },
        { id: 5, uri: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600' },
        { id: 6, uri: 'https://images.unsplash.com/photo-1476611317561-60117649dd94?q=80&w=600' },
    ];

    const scrollRef = useRef(null);
    const [ringCabinetY, setRingCabinetY] = useState(0);

    const scrollToRingCabinet = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ y: ringCabinetY - 20, animated: true });
        }
    };

    // Heart beat scale animation
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.12,
                    duration: 950,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1.0,
                    duration: 950,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [pulseAnim]);

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text.trim() === "") {
            setFriends(DUMMY_FRIENDS);
        } else {
            const filtered = DUMMY_FRIENDS.filter(f =>
                f.name.toLowerCase().includes(text.toLowerCase()) ||
                f.displayId.includes(text)
            );
            setFriends(filtered);
        }
    };

    const getModalFriends = () => {
        if (!modalSearchQuery.trim()) {
            return DUMMY_FRIENDS;
        }
        return DUMMY_FRIENDS.filter(f =>
            f.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
            f.displayId.includes(modalSearchQuery)
        );
    };

    const handleInvite = (friend) => {
        Alert.alert(
            "CP Connection",
            `Do you want to bind the CP relationship with ${friend.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Bind CP",
                    onPress: () => {
                        setIsBound(true);
                        setPartner(friend);
                    }
                }
            ]
        );
    };

    const handleRemoveCP = () => {
        Alert.alert(
            "Remove CP Relationship",
            "Are you sure you want to dissolve the CP relationship? This will reset your intimacy progress and remove exclusive badge privileges.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Dissolve CP",
                    style: "destructive",
                    onPress: () => {
                        setIsBound(false);
                        setPartner(null);
                    }
                }
            ]
        );
    };

    const userAvatarUri = profile?.avatarUrl || profile?.profilePictureUrl;
    const userAvatar = userAvatarUri
        ? (userAvatarUri.startsWith('http') ? userAvatarUri : `https://landing.hostingsky.in${userAvatarUri}`)
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* UNBOUND VIEW (Slot config + Friend listing) */}
            {!isBound ? (
                <View style={{ flex: 1 }}>
                    {/* Top Half: Love House Background & Slots */}
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop' }}
                        style={styles.topHalf}
                        resizeMode="cover"
                    >
                        <LinearGradient
                            colors={['rgba(26, 18, 11, 0.4)', 'rgba(17, 11, 7, 0.85)', '#0B0806']}
                            style={styles.gradientOverlay}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                                    <ChevronLeft color="#E6C27A" size={24} />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>CP Space</Text>
                                <View style={styles.headerRight}>
                                    <TouchableOpacity style={styles.headerCpBtn} onPress={() => navigation.navigate('CPDetailsScreen')}>
                                        <Text style={styles.headerCpBtnText}>CP</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.headerIconBtn} onPress={() => setAboutVisible(true)}>
                                        <HelpCircle color="#E6C27A" size={22} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Glassmorphic Panel holding Slots */}
                            <View style={styles.glassPanel}>
                                <View style={styles.slotsContainer}>
                                    {/* User Slot */}
                                    <View style={styles.slotBlock}>
                                        <View style={styles.avatarBorderGlow}>
                                            <Image
                                                source={{ uri: userAvatar }}
                                                style={styles.slotAvatar}
                                            />
                                        </View>
                                        <Text style={styles.slotName} numberOfLines={1}>
                                            🇮🇳 {profile?.displayName || profile?.name || "Venom"}
                                        </Text>
                                    </View>

                                    {/* Pulsing Center Heart Shield */}
                                    <View style={styles.heartBlock}>
                                        <Animated.View style={[styles.pulseWrapper, { transform: [{ scale: pulseAnim }] }]}>
                                            <LinearGradient
                                                colors={['#E6C27A', '#9B7C3E']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={styles.heartCircle}
                                            >
                                                <Heart color="#0B0806" size={20} fill="#0B0806" />
                                            </LinearGradient>
                                        </Animated.View>
                                    </View>

                                    {/* Partner Slot (Add Slot) */}
                                    <View style={styles.slotBlock}>
                                        <TouchableOpacity
                                            onPress={() => { setAddCPModalVisible(true); setModalSearchQuery(""); }}
                                            style={styles.avatarBorderDashed}
                                            activeOpacity={0.8}
                                        >
                                            <Plus color="#E6C27A" size={28} strokeWidth={2.5} />
                                        </TouchableOpacity>
                                        <Text style={styles.addText}>Add</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Golden Requirement Badge */}
                            <View style={styles.goldenBadge}>
                                <LinearGradient
                                    colors={['#2A1E15', '#17110C']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.goldenBadgeGradient}
                                >
                                    <Text style={styles.goldenBadgeText}>
                                        ✨ guard value greater than 3600 to become a CP
                                    </Text>
                                </LinearGradient>
                            </View>
                        </LinearGradient>
                    </ImageBackground>

                    {/* Bottom Half: Friends List */}
                    <View style={styles.bottomHalf}>
                        <Text style={styles.sectionTitle}>Friends that can be bound to CP</Text>

                        {/* Search Bar */}
                        <View style={styles.searchBar}>
                            <Search color="#E6C27A" size={18} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Enter ID"
                                placeholderTextColor="#8B7A6A"
                                value={searchQuery}
                                onChangeText={handleSearch}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Friends List */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                        >
                            {friends.map((item) => (
                                <View key={item.id} style={styles.friendRow}>
                                    <View style={styles.friendLeft}>
                                        <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
                                        <View style={styles.friendDetails}>
                                            <Text style={styles.friendName} numberOfLines={1}>{item.name}</Text>
                                            {item.hasBadge ? (
                                                <LinearGradient
                                                    colors={['#E6C27A', '#9B7C3E']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={styles.idBadge}
                                                >
                                                    <Text style={styles.idBadgeText}>ID {item.displayId}</Text>
                                                </LinearGradient>
                                            ) : (
                                                <Text style={styles.friendIdText} numberOfLines={1}>ID:{item.displayId}</Text>
                                            )}
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleInvite(item)}
                                        activeOpacity={0.85}
                                    >
                                        <LinearGradient
                                            colors={['#E6C27A', '#9B7C3E']}
                                            style={styles.inviteBtn}
                                        >
                                            <Text style={styles.inviteBtnText}>Invite</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {friends.length === 0 && (
                                <View style={styles.emptyView}>
                                    <Text style={styles.emptyText}>No friends found</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            ) : (
                /* BOUND ACTIVE CP VIEW (CP NEST) */
                <View style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={styles.cpHeader}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <ChevronLeft color="#E6C27A" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.cpHeaderTitle}>CP Nest</Text>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.headerIconBtn}
                                onPress={() => setNestBgModalVisible(true)}
                                activeOpacity={0.8}
                            >
                                <Shirt color="#E6C27A" size={16} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerCpBtn} onPress={() => navigation.navigate('CPDetailsScreen')}>
                                <Text style={styles.headerCpBtnText}>CP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIconBtn} onPress={handleRemoveCP}>
                                <MoreHorizontal color="#E6C27A" size={24} />
                            </TouchableOpacity>

                        </View>
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.cpScrollContent}
                    >
                        {/* 3D Castle Hall Banner Background */}
                        <ImageBackground
                            source={{ uri: nestBackground }}
                            style={styles.cpNestBanner}
                            resizeMode="cover"
                        >
                            <LinearGradient
                                colors={['rgba(11, 8, 6, 0.1)', 'rgba(11, 8, 6, 0.55)', '#0B0806']}
                                style={styles.cpNestOverlay}
                            >
                                {/* Floating round Shirt (Theme) button - top right of nest banner */}
                                {/* <TouchableOpacity
                                    style={styles.nestEditBtn}
                                    onPress={() => setNestBgModalVisible(true)}
                                    activeOpacity={0.8}
                                >
                                    <Shirt color="#E6C27A" size={16} />
                                </TouchableOpacity> */}

                                {/* Floating Nest Avatars with heart level linking */}
                                <View style={styles.nestAvatarsRow}>
                                    <View style={styles.nestAvatarWrapper}>
                                        <Image source={{ uri: userAvatar }} style={styles.nestAvatar} />
                                        <Text style={styles.nestName} numberOfLines={1}>
                                            ★ {profile?.displayName || profile?.name || "Amayra"}
                                        </Text>
                                    </View>

                                    <View style={styles.nestHeartLink}>
                                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                            <LinearGradient
                                                colors={['#E6C27A', '#9B7C3E']}
                                                style={styles.nestHeartCircle}
                                            >
                                                <Heart color="#0B0806" size={14} fill="#0B0806" />
                                                {/* <Text style={styles.nestHeartLevel}>31</Text> */}
                                            </LinearGradient>
                                        </Animated.View>
                                    </View>

                                    <View style={styles.nestAvatarWrapper}>
                                        <Image source={{ uri: partner?.avatar }} style={styles.nestAvatar} />
                                        <Text style={styles.nestName} numberOfLines={1}>
                                            ★ {partner?.name || "SUHEL K..."}
                                        </Text>
                                    </View>
                                </View>

                                {/* 3D golden wedding/pedestal stage layout */}
                                <View style={styles.pedestalWrapper}>
                                    <Image
                                        source={{ uri: 'https://images.unsplash.com/photo-1618005198143-d3667564d96a?q=80&w=300' }}
                                        style={styles.pedestalStageImage}
                                        resizeMode="contain"
                                    />
                                    <View style={styles.pedestalGlowContainer}>
                                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                            <Sparkles color="#E6C27A" size={24} fill="rgba(230, 194, 122, 0.2)" />
                                        </Animated.View>
                                    </View>
                                    <Sparkles color="#E6C27A" size={8} style={[styles.sparklePosition, { top: 5, left: '22%' }]} />
                                    <Sparkles color="#E6C27A" size={10} style={[styles.sparklePosition, { top: 15, right: '24%' }]} />
                                </View>

                                {/* Pill button for Ring Box elegantly under the stage */}
                                <View style={styles.bannerPillButtonsRow}>
                                    <TouchableOpacity onPress={scrollToRingCabinet} style={styles.bannerPillBtn}>
                                        <Gem color="#E6C27A" size={13} style={{ marginRight: 4 }} />
                                        <Text style={styles.bannerPillText}>Ring Box</Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </ImageBackground>

                        {/* Card 1: Intimacy Love Days Card */}
                        <View style={styles.cpCard}>
                            <View style={styles.cardHeaderRibbon}>
                                <Text style={styles.ribbonText}>Intimacy</Text>
                            </View>

                            <Text style={styles.loveDaysLabel}>Love days</Text>

                            {/* Winged heart intimacy center display */}
                            <View style={styles.wingedIntimacyWrapper}>
                                <Image source={{ uri: userAvatar }} style={styles.intimacySideAvatar} />

                                <View style={styles.wingedHeartBox}>
                                    <View style={styles.intimacyWingLeft}>
                                        <Text style={styles.wingFeather}>ʚ</Text>
                                    </View>
                                    <View style={styles.intimacyWingRight}>
                                        <Text style={styles.wingFeather}>ɞ</Text>
                                    </View>

                                    <LinearGradient colors={['#FF4B2B', '#FF416C']} style={styles.intimacyHeart}>
                                        <Text style={styles.intimacyLevelText}>31</Text>
                                        <Text style={styles.loveDaysCount}>481</Text>
                                        <Heart color="#fff" size={10} fill="#fff" style={{ marginTop: 1 }} />
                                    </LinearGradient>
                                </View>

                                <Image source={{ uri: partner?.avatar }} style={styles.intimacySideAvatar} />
                            </View>

                            <Text style={styles.sinceText}>Since: 01/03/2025</Text>

                            {/* Progress intimacy bar */}
                            <View style={styles.progressBarWrapper}>
                                <Text style={styles.progressLabel}>Lv.31</Text>
                                <View style={styles.progressTrack}>
                                    <LinearGradient
                                        colors={['#E6C27A', '#F59E0B']}
                                        style={[styles.progressFill, { width: '92%' }]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />
                                    <Text style={styles.progressScoreText}>6699.8M/6925.5M</Text>
                                </View>
                                <Text style={styles.progressLabel}>Lv.32</Text>
                            </View>

                            <Text style={styles.progressHelpText}>
                                To advance to the next level, you still need 225.7M intimacy.
                            </Text>
                        </View>

                        {/* Card 2: Ring Cabinet (Clean design with gold rails) */}
                        <View onLayout={(event) => setRingCabinetY(event.nativeEvent.layout.y)} style={styles.cpCard}>
                            <View style={styles.cardHeaderRibbon}>
                                <Text style={styles.ribbonText}>Ring cabinet(14)</Text>
                            </View>

                            {/* Ring shelves container */}
                            <View style={styles.shelvesWrapper}>
                                {/* Shelf 1 */}
                                <View style={styles.shelfRow}>
                                    <View style={styles.shelfGrid}>
                                        <View style={styles.ringSlot}>
                                            <Sparkles color="#E6C27A" size={22} />
                                        </View>
                                        <View style={styles.ringSlot}>
                                            <Gem color="#60A5FA" size={22} />
                                        </View>
                                        <View style={styles.ringSlot}>
                                            <Crown color="#FBBF24" size={22} />
                                        </View>
                                        <View style={styles.ringSlot}>
                                            <Award color="#F472B6" size={22} />
                                        </View>
                                    </View>
                                    <View style={styles.goldShelfBar} />
                                </View>

                                {/* Shelf 2 */}
                                <View style={styles.shelfRow}>
                                    <View style={styles.shelfGrid}>
                                        <View style={styles.ringSlot}>
                                            <Heart color="#F87171" size={22} fill="#F87171" />
                                        </View>
                                        <View style={styles.ringSlot}>
                                            <Sparkles color="#A78BFA" size={22} />
                                        </View>
                                        <View style={styles.ringSlot}>
                                            <Gem color="#34D399" size={22} />
                                        </View>
                                        <View style={styles.ringSlot}>
                                            <Crown color="#E6C27A" size={22} />
                                        </View>
                                    </View>
                                    <View style={styles.goldShelfBar} />
                                </View>
                            </View>
                        </View>

                        {/* Card 3: CP Memory Grid of collected items (3-column layout) */}
                        <View style={styles.cpCard}>
                            <View style={styles.cardHeaderRibbon}>
                                <Text style={styles.ribbonText}>CP Memory(20)</Text>
                            </View>

                            <View style={styles.memoryGrid}>
                                <View style={styles.memoryItem}>
                                    <Crown color="#E6C27A" size={24} />
                                    <Text style={styles.memoryCount}>x1</Text>
                                </View>
                                <View style={styles.memoryItem}>
                                    <Gift color="#60A5FA" size={24} />
                                    <Text style={styles.memoryCount}>x1</Text>
                                </View>
                                <View style={styles.memoryItem}>
                                    <Award color="#F472B6" size={24} />
                                    <Text style={styles.memoryCount}>x2</Text>
                                </View>
                                <View style={styles.memoryItem}>
                                    <BookOpen color="#34D399" size={24} />
                                    <Text style={styles.memoryCount}>x1</Text>
                                </View>
                                <View style={styles.memoryItem}>
                                    <Sparkles color="#FBBF24" size={24} />
                                    <Text style={styles.memoryCount}>x1</Text>
                                </View>
                                <View style={styles.memoryItem}>
                                    <Gem color="#F472B6" size={24} />
                                    <Text style={styles.memoryCount}>x2</Text>
                                </View>
                                <View style={styles.memoryItem}>
                                    <Crown color="#60A5FA" size={24} />
                                    <Text style={styles.memoryCount}>x2</Text>
                                </View>
                                <View style={styles.memoryItem}>
                                    <Heart color="#F87171" size={24} />
                                    <Text style={styles.memoryCount}>x1</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Add CP Modal */}
            <Modal
                visible={addCPModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setAddCPModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add CP</Text>
                            <TouchableOpacity onPress={() => setAddCPModalVisible(false)} style={styles.modalCloseBtn}>
                                <X color="#E6C27A" size={24} />
                            </TouchableOpacity>
                        </View>

                        {/* Modal Body */}
                        <View style={styles.modalBody}>
                            {/* Search Bar */}
                            <View style={styles.modalSearchBar}>
                                <Search color="#E6C27A" size={18} style={styles.modalSearchIcon} />
                                <TextInput
                                    style={styles.modalSearchInput}
                                    placeholder="Enter ID"
                                    placeholderTextColor="#8B7A6A"
                                    value={modalSearchQuery}
                                    onChangeText={setModalSearchQuery}
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Friends Scroll */}
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalListContainer}>
                                {getModalFriends().map((item) => (
                                    <View key={item.id} style={styles.modalFriendRow}>
                                        <View style={styles.modalFriendLeft}>
                                            <View style={styles.modalFriendAvatarContainer}>
                                                <Image source={{ uri: item.avatar }} style={styles.modalFriendAvatar} />
                                            </View>
                                            <View style={styles.modalFriendDetails}>
                                                <View style={styles.modalNameRow}>
                                                    <View style={[styles.statusDot, { backgroundColor: item.isOnline ? '#22c55e' : 'rgba(255, 255, 255, 0.3)' }]} />
                                                    <Text style={styles.modalFriendName} numberOfLines={1}>{item.name}</Text>
                                                    <View style={[styles.genderBadge, { backgroundColor: item.gender === 'male' ? '#e0f2fe' : '#fce7f3' }]}>
                                                        <Text style={[styles.genderText, { color: item.gender === 'male' ? '#0284c7' : '#db2777' }]}>
                                                            {item.gender === 'male' ? '♂' : '♀'}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.modalFlagIcon}>{item.flag}</Text>
                                                </View>

                                                {item.hasBadge ? (
                                                    <LinearGradient
                                                        colors={['#E6C27A', '#9B7C3E']}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 1 }}
                                                        style={styles.modalIdBadge}
                                                    >
                                                        <View style={styles.idBadgeCircle}>
                                                            <Text style={styles.idBadgeCircleText}>ID</Text>
                                                        </View>
                                                        <Text style={styles.modalIdBadgeText}>{item.displayId}</Text>
                                                    </LinearGradient>
                                                ) : (
                                                    <Text style={styles.modalFriendIdText} numberOfLines={1}>ID:{item.displayId}</Text>
                                                )}
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => {
                                                setAddCPModalVisible(false);
                                                handleInvite(item);
                                            }}
                                            activeOpacity={0.85}
                                        >
                                            <LinearGradient
                                                colors={['#E6C27A', '#9B7C3E']}
                                                style={styles.modalInviteBtn}
                                            >
                                                <Text style={styles.modalInviteBtnText}>Invite</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                {getModalFriends().length === 0 && (
                                    <View style={styles.modalEmptyView}>
                                        <Text style={styles.modalEmptyText}>No friends found</Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* About Modal */}
            <Modal
                visible={aboutVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setAboutVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContentSmall}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>CP Space About</Text>
                            <TouchableOpacity onPress={() => setAboutVisible(false)} style={styles.modalCloseBtn}>
                                <X color="#E6C27A" size={24} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBodySmall}>
                            <Text style={styles.infoModalText}>
                                1. Bind with your partner once Guard Value reaches 3,600.{"\n"}{"\n"}
                                2. Bound CP enter the Love House to display milestones, share memory collections, and custom-level rings.{"\n"}{"\n"}
                                3. Unlocks exclusive tags, custom mic frames, entry animations, and notification announcements.
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Privileges Modal */}
            <Modal
                visible={privilegeVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPrivilegeVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContentSmall}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>CP Privileges</Text>
                            <TouchableOpacity onPress={() => setPrivilegeVisible(false)} style={styles.modalCloseBtn}>
                                <X color="#E6C27A" size={24} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBodySmall}>
                            <View style={styles.privilegeRow}>
                                <Crown color="#E6C27A" size={18} />
                                <Text style={styles.privilegeText}>Room MIC Golden Ring Crown</Text>
                            </View>
                            <View style={styles.privilegeRow}>
                                <Sparkles color="#E6C27A" size={18} />
                                <Text style={styles.privilegeText}>Exclusive CP Room Entry Effect</Text>
                            </View>
                            <View style={styles.privilegeRow}>
                                <Gem color="#E6C27A" size={18} />
                                <Text style={styles.privilegeText}>Speed Intimacy Booster multipliers</Text>
                            </View>
                            <View style={styles.privilegeRow}>
                                <Award color="#E6C27A" size={18} />
                                <Text style={styles.privilegeText}>Anniversary exclusive gift items</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* CP Nest Background Picker Modal */}
            <Modal
                visible={nestBgModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setNestBgModalVisible(false)}
            >
                <View style={styles.nestBgOverlay}>
                    <View style={styles.nestBgSheet}>
                        {/* Handle bar */}
                        <View style={styles.nestBgHandle} />
                        <Text style={styles.nestBgTitle}>Choose Nest Background</Text>

                        {/* Preview */}
                        <Image
                            source={{ uri: nestBackground }}
                            style={styles.nestBgPreview}
                            resizeMode="cover"
                        />

                        {/* Thumbnail grid */}
                        <View style={styles.nestBgGrid}>
                            {NEST_THEMES.map((theme) => (
                                <TouchableOpacity
                                    key={theme.id}
                                    onPress={() => {
                                        setNestBackground(theme.uri);
                                        setNestBgModalVisible(false);
                                    }}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.nestBgThumb,
                                        nestBackground === theme.uri && styles.nestBgThumbActive
                                    ]}
                                >
                                    <Image source={{ uri: theme.uri }} style={styles.nestBgThumbImg} resizeMode="cover" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.nestBgCancelBtn}
                            onPress={() => setNestBgModalVisible(false)}
                        >
                            <Text style={styles.nestBgCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0806',
    },
    topHalf: {
        width: '100%',
        height: 410,
    },
    gradientOverlay: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 50,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backBtn: {
        padding: 6,
        backgroundColor: 'rgba(230, 194, 122, 0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.1)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E6C27A',
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
        textShadowOffset: { width: 1, height: 1.5 },
        textShadowRadius: 4,
    },
    headerIconBtn: {
        padding: 6,
        backgroundColor: 'rgba(230, 194, 122, 0.05)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.1)',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerCpBtn: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        backgroundColor: 'rgba(230, 194, 122, 0.15)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E6C27A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCpBtnText: {
        color: '#E6C27A',
        fontSize: 12,
        fontWeight: 'bold',
    },
    glassPanel: {
        backgroundColor: 'rgba(18, 14, 11, 0.75)',
        borderRadius: 24,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        paddingVertical: 22,
        paddingHorizontal: 10,
        marginHorizontal: 16,
        marginTop: 15,
    },
    slotsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    slotBlock: {
        alignItems: 'center',
        width: 95,
    },
    avatarBorderGlow: {
        width: 82,
        height: 82,
        borderRadius: 41,
        borderWidth: 3,
        borderColor: '#E6C27A',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#120E0B',
    },
    slotAvatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    slotName: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        width: '95%',
    },
    avatarBorderDashed: {
        width: 82,
        height: 82,
        borderRadius: 41,
        borderWidth: 2,
        borderColor: '#E6C27A',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(230, 194, 122, 0.03)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addText: {
        color: '#8B7A6A',
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    heartBlock: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseWrapper: {
        zIndex: 5,
    },
    heartCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E6C27A',
    },
    goldenBadge: {
        alignSelf: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.25)',
        marginBottom: 16,
    },
    goldenBadgeGradient: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goldenBadgeText: {
        color: '#E6C27A',
        fontSize: 11.5,
        fontWeight: '600',
        textAlign: 'center',
    },
    bottomHalf: {
        flex: 1,
        backgroundColor: '#0B0806',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#E6C27A',
        marginBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#120E0B',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 12 : 5,
        marginBottom: 16,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    listContainer: {
        paddingBottom: 40,
    },
    friendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#120E0B',
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.12)',
    },
    friendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 12,
    },
    friendAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
    },
    friendDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    friendName: {
        fontSize: 14.5,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    idBadge: {
        alignSelf: 'flex-start',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    idBadgeText: {
        color: '#0B0806',
        fontSize: 10,
        fontWeight: 'bold',
    },
    friendIdText: {
        fontSize: 11,
        color: '#8B7A6A',
        fontWeight: '600',
    },
    inviteBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inviteBtnText: {
        color: '#0B0806',
        fontWeight: 'bold',
        fontSize: 12.5,
    },
    emptyView: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#8B7A6A',
        fontSize: 14,
    },

    /* ACTIVE CP NEST STYLES */
    cpHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 12,
        paddingBottom: 10,
        backgroundColor: '#0B0806',
    },
    cpHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E6C27A',
    },
    cpScrollContent: {
        paddingBottom: 40,
        gap: 16,
    },
    cpNestBanner: {
        width: '100%',
        height: 600,
    },
    cpNestOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingBottom: 20,
    },
    nestEditBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(11, 8, 6, 0.75)',
        borderWidth: 1.5,
        borderColor: '#E6C27A',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    nestBgOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    nestBgSheet: {
        backgroundColor: '#120E0B',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 32,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: 'rgba(230,194,122,0.2)',
    },
    nestBgHandle: {
        width: 44,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E6C27A',
        alignSelf: 'center',
        marginBottom: 16,
        opacity: 0.5,
    },
    nestBgTitle: {
        color: '#E6C27A',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 14,
    },
    nestBgPreview: {
        width: '100%',
        height: 160,
        borderRadius: 14,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
    },
    nestBgGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 18,
    },
    nestBgThumb: {
        width: 90,
        height: 60,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    nestBgThumbActive: {
        borderColor: '#E6C27A',
    },
    nestBgThumbImg: {
        width: '100%',
        height: '100%',
    },
    nestBgCancelBtn: {
        alignSelf: 'center',
        paddingHorizontal: 32,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E6C27A',
    },
    nestBgCancelText: {
        color: '#E6C27A',
        fontSize: 14,
        fontWeight: '600',
    },
    pedestalWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 95,
        width: '100%',
        marginTop: 8,
        marginBottom: 100,
        position: 'relative',
    },
    pedestalStageImage: {
        width: 260,
        height: 85,
        opacity: 0.85,
    },
    pedestalGlowContainer: {
        marginBottom: -50,
        position: 'absolute',
        bottom: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sparklePosition: {
        position: 'absolute',
    },
    nestAvatarsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginBottom: 16,
        marginTop: 180,
    },
    nestAvatarWrapper: {
        alignItems: 'center',
    },
    nestAvatar: {
        width: 74,
        height: 74,
        borderRadius: 37,
        borderWidth: 2,
        borderColor: '#E6C27A',
    },
    nestName: {
        color: '#FFF',
        fontSize: 12.5,
        fontWeight: 'bold',
        marginTop: 6,
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    nestHeartLink: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    nestHeartCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
        position: 'relative',
    },
    nestHeartLevel: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 5,
    },
    bannerPillButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 15
    },
    bannerPillBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1612',
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.25)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    bannerPillText: {
        color: '#E6C27A',
        fontSize: 11.5,
        fontWeight: 'bold',
    },
    cpCard: {
        backgroundColor: '#120E0B',
        borderRadius: 24,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        marginHorizontal: 16,
        padding: 16,
        alignItems: 'center',
    },
    cardHeaderRibbon: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        backgroundColor: '#1C1612',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.25)',
        alignSelf: 'center',
        marginBottom: 16,
    },
    ribbonText: {
        color: '#E6C27A',
        fontSize: 13,
        fontWeight: 'bold',
    },
    loveDaysLabel: {
        color: '#8B7A6A',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    wingedIntimacyWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
        marginBottom: 12,
    },
    intimacySideAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
    },
    wingedHeartBox: {
        width: 100,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    intimacyWingLeft: {
        position: 'absolute',
        left: -8,
        zIndex: 1,
    },
    intimacyWingRight: {
        position: 'absolute',
        right: -8,
        zIndex: 1,
    },
    wingFeather: {
        color: '#E6C27A',
        fontSize: 48,
        fontWeight: '300',
        opacity: 0.8,
    },
    intimacyHeart: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFF',
        shadowColor: '#FF416C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 6,
        zIndex: 2,
    },
    intimacyLevelText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    loveDaysCount: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -2,
    },
    sinceText: {
        color: '#8B7A6A',
        fontSize: 11.5,
        fontWeight: '500',
        marginBottom: 16,
    },
    progressBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        paddingHorizontal: 8,
    },
    progressLabel: {
        color: '#E6C27A',
        fontSize: 11,
        fontWeight: 'bold',
    },
    progressTrack: {
        flex: 1,
        height: 14,
        backgroundColor: '#221811',
        borderRadius: 7,
        overflow: 'hidden',
        justifyContent: 'center',
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        borderRadius: 7,
    },
    progressScoreText: {
        position: 'absolute',
        alignSelf: 'center',
        color: '#FFF',
        fontSize: 9,
        fontWeight: 'bold',
        zIndex: 2,
    },
    progressHelpText: {
        color: '#8B7A6A',
        fontSize: 11,
        marginTop: 10,
        textAlign: 'center',
    },

    /* SHELVES DISPLAY */
    shelvesWrapper: {
        width: '100%',
        gap: 20,
    },
    shelfRow: {
        width: '100%',
        alignItems: 'center',
    },
    shelfGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 2,
    },
    ringSlot: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
    },
    goldShelfBar: {
        width: '90%',
        height: 3.5,
        backgroundColor: '#9B7C3E',
        borderRadius: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 1,
    },

    /* CP MEMORY GRID */
    memoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        width: '100%',
    },
    memoryItem: {
        width: (width - 32 - 32 - 24) / 3,
        height: 85,
        backgroundColor: '#1E1712',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    memoryCount: {
        position: 'absolute',
        bottom: 8,
        color: '#8B7A6A',
        fontSize: 10,
        fontWeight: 'bold',
    },

    /* MODAL OVERLAYS */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '65%',
        backgroundColor: '#0B0806',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
        overflow: 'hidden',
    },
    modalContentSmall: {
        width: '85%',
        backgroundColor: '#120E0B',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
        overflow: 'hidden',
        paddingBottom: 20,
    },
    modalHeader: {
        height: 52,
        backgroundColor: '#120E0B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: '#221811',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E6C27A',
    },
    modalCloseBtn: {
        position: 'absolute',
        right: 16,
        padding: 6,
    },
    modalBody: {
        flex: 1,
        padding: 16,
    },
    modalBodySmall: {
        padding: 20,
    },
    modalSearchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#120E0B',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 10 : 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.2)',
    },
    modalSearchIcon: {
        marginRight: 8,
    },
    modalSearchInput: {
        flex: 1,
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    modalListContainer: {
        paddingBottom: 20,
    },
    modalFriendRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#120E0B',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.12)',
    },
    modalFriendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 8,
    },
    modalFriendAvatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginRight: 12,
    },
    modalFriendAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },
    modalFriendDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    modalNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    modalFriendName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        flexShrink: 1,
    },
    genderBadge: {
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
    },
    genderText: {
        fontSize: 10,
        fontWeight: 'bold',
        lineHeight: 12,
    },
    modalFlagIcon: {
        fontSize: 13,
        marginLeft: 6,
    },
    modalIdBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E6C27A',
        paddingLeft: 2,
        paddingRight: 8,
        paddingVertical: 1,
        alignSelf: 'flex-start',
    },
    idBadgeCircle: {
        backgroundColor: '#E6C27A',
        width: 14,
        height: 14,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    idBadgeCircleText: {
        color: '#0B0806',
        fontSize: 8,
        fontWeight: '900',
    },
    modalIdBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    modalFriendIdText: {
        fontSize: 11,
        color: '#8B7A6A',
        fontWeight: '600',
        paddingLeft: 4,
    },
    modalInviteBtn: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalInviteBtnText: {
        color: '#0B0806',
        fontWeight: 'bold',
        fontSize: 12,
    },
    modalEmptyView: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    modalEmptyText: {
        color: '#8B7A6A',
        fontSize: 14,
    },
    infoModalText: {
        color: '#A08B7D',
        fontSize: 13,
        lineHeight: 19,
    },
    privilegeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#221811',
    },
    privilegeText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '500',
    },
});
