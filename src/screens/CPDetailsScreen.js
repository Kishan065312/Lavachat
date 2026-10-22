import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    StatusBar,
    Platform,
    ImageBackground,
    Alert,
    Modal
} from 'react-native';
import { ChevronLeft, Shirt, MoreHorizontal, Bell, Gift, Sparkles, Heart, Crown, Mail, Home, Megaphone, Smile, Plus, X, Pencil } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const PRIVILEGES = [
    {
        id: '1',
        title: 'CP Card',
        description: 'Unlock an exclusive pink and gold-decorated card on your profile to proudly display your romantic CP relationship details.',
        iconType: 'card',
    },
    {
        id: '2',
        title: 'CP Online Notification',
        description: 'Receive real-time push alerts and marquee banners in channels when your CP logs in to the application.',
        iconType: 'bell',
    },
    {
        id: '3',
        title: 'Unlock CP House',
        description: 'Access the premium 3D Castle Hall and custom virtual layout to showcase your ring box and achievements.',
        iconType: 'castle',
    },
    {
        id: '4',
        title: 'CP together profile',
        description: 'Link your profiles together side-by-side with a customized animated heart border showing your intimacy status.',
        iconType: 'avatars',
    },
    {
        id: '5',
        title: 'Unlock Exclusive CP Gifts',
        description: 'Unlock unique, high-tier gifts like Love Castle and Graffiti Star that can only be sent to your bound CP.',
        iconType: 'gift',
    },
    {
        id: '6',
        title: 'Unlock Proposal Function',
        description: 'Gain access to the wedding proposal flow, dynamic invitation templates, and dedicated ceremony announcement channels.',
        iconType: 'proposal',
    },
    {
        id: '7',
        title: 'CP Online Effect',
        description: 'Trigger customized romantic entry effects and shiny mic frame borders when you join room lobbies together.',
        iconType: 'effect',
    },
    {
        id: '8',
        title: 'CP Sending Notification i...',
        description: 'Broadcast full-screen banner notifications to all users in the room when you send a gift to your partner.',
        iconType: 'megaphone',
    },
    {
        id: '9',
        title: 'CP Emoji',
        description: 'Unlock exclusive animated CP emoticons for chat and mic statuses.',
        iconType: 'emoji',
    },
];

export default function CPDetailsScreen() {
    const navigation = useNavigation();
    const profile = useSelector((state) => state.auth.profile);
    const [menuVisible, setMenuVisible] = useState(false);
    const [themeModalVisible, setThemeModalVisible] = useState(false);
    const [selectedPrivilege, setSelectedPrivilege] = useState(null);
    const [cpLevel] = useState(9);

    // Luxury dark space background matching CPSpaceScreen.js theme
    const [roomBackground, setRoomBackground] = useState('https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?q=80&w=600&auto=format&fit=crop');

    const [themes, setThemes] = useState([
        { id: '1', url: 'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?q=80&w=600&auto=format&fit=crop', label: 'Default' },
        { id: '2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600', label: 'LV.6' },
        { id: '3', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600', label: 'LV.7' },
        { id: '4', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=600', label: 'LV.8' }
    ]);

    const handleSelectCustomTheme = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.didCancel) {
                return;
            }
            if (response.errorMessage) {
                Alert.alert("Error", response.errorMessage);
                return;
            }
            if (response.assets && response.assets.length > 0) {
                const selectedUri = response.assets[0].uri;
                const newTheme = {
                    id: String(Date.now()),
                    url: selectedUri,
                    label: 'Custom'
                };
                setThemes(prev => [newTheme, ...prev]);
                setRoomBackground(selectedUri);
            }
        });
    };

    const userAvatarUri = profile?.avatarUrl || profile?.profilePictureUrl;
    const userAvatar = userAvatarUri
        ? (userAvatarUri.startsWith('http') ? userAvatarUri : `https://landing.hostingsky.in${userAvatarUri}`)
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    const partnerAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'; // VP dummy partner avatar

    const handleDivorce = () => {
        setMenuVisible(false);
        Alert.alert(
            "Divorce CP",
            "Are you sure you want to dissolve your CP space relationship? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Divorce",
                    style: "destructive",
                    onPress: () => {
                        Alert.alert("Relationship Dissolved", "Your CP space has been dissolved successfully.");
                    }
                }
            ]
        );
    };

    const handleRule = () => {
        setMenuVisible(false);
        Alert.alert(
            "CP Space Rules",
            "1. Guard value increases when you play games and send gifts together.\n2. Once bound, you unlock exclusive chat bubbles and effects.\n3. Dissolving relationship has a 48 hour cooldown before you can bind with someone else.",
            [{ text: "OK" }]
        );
    };

    const renderPrivilegeIcon = (type, isLarge = false) => {
        const size = isLarge ? 48 : 28;
        switch (type) {
            case 'card':
                return (
                    <LinearGradient
                        colors={['#FF4E7E', '#FF809B']}
                        style={[styles.iconCardFrame, isLarge && styles.iconCardFrameLarge]}
                    >
                        <View style={styles.iconCardInner} />
                    </LinearGradient>
                );
            case 'bell':
                return (
                    <Bell color="#F59E0B" size={size} fill="#F59E0B" />
                );
            case 'castle':
                return (
                    <Home color="#A78BFA" size={size} fill="#A78BFA" />
                );
            case 'avatars':
                return (
                    <View style={[styles.overlapAvatarsWrapper, isLarge && styles.overlapAvatarsWrapperLarge]}>
                        <Image source={{ uri: userAvatar }} style={[styles.overlapAvatar, isLarge && styles.overlapAvatarLarge]} />
                        <View style={[styles.overlapAvatarHeart, isLarge && styles.overlapAvatarHeartLarge]}>
                            <Heart color="#EF4444" size={isLarge ? 12 : 8} fill="#EF4444" />
                        </View>
                        <Image source={{ uri: partnerAvatar }} style={[styles.overlapAvatar, isLarge && styles.overlapAvatarLarge, { marginLeft: -8 }]} />
                    </View>
                );
            case 'gift':
                return (
                    <Gift color="#EC4899" size={size} fill="#EC4899" />
                );
            case 'proposal':
                return (
                    <Mail color="#EF4444" size={size} fill="#EF4444" />
                );
            case 'effect':
                return (
                    <Sparkles color="#38BDF8" size={size} fill="#38BDF8" />
                );
            case 'megaphone':
                return (
                    <Megaphone color="#E6C27A" size={size} fill="#E6C27A" />
                );
            case 'emoji':
                return (
                    <Smile color="#FBBF24" size={size} fill="#FBBF24" />
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Dark Luxury Sky/Space Background */}
            <ImageBackground
                source={{ uri: roomBackground }}
                style={styles.topSection}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(26, 18, 11, 0.4)', 'rgba(17, 11, 7, 0.85)', '#0B0806']}
                    style={styles.gradientOverlay}
                >
                    {/* Header: Preserves BOTH the Shirt & MoreHorizontal buttons with Gold Scheme */}
                    <SafeAreaView style={styles.safeHeader}>
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                                <ChevronLeft color="#E6C27A" size={24} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>CP Level</Text>
                            <View style={styles.headerRight}>
                                <TouchableOpacity style={styles.headerIconBtn} onPress={() => setMenuVisible(true)}>
                                    <MoreHorizontal color="#E6C27A" size={22} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>

                    {/* Winged Heart Centerpiece Emblem */}
                    <View style={styles.archCenterpiece}>
                        <View style={styles.wingedHeartRow}>
                            {/* Left Wing Majestic Feather Layers */}
                            <View style={[styles.wingContainer, styles.leftWingPosition]}>
                                <View style={[styles.wingFeather, styles.leftFeather1]} />
                                <View style={[styles.wingFeather, styles.leftFeather2]} />
                                <View style={[styles.wingFeather, styles.leftFeather3]} />
                                <View style={[styles.wingFeather, styles.leftFeather4]} />
                            </View>

                            {/* Center Circular Emblem with heart and overlapping LV.9 banner */}
                            <View style={styles.emblemContainer}>
                                <LinearGradient
                                    colors={['#E6C27A', '#9B7C3E']}
                                    style={styles.heartEmblem}
                                >
                                    <Crown color="#0B0806" size={24} fill="#0B0806" style={styles.crownDecoration} />
                                    <View style={styles.innerEmblemHeart}>
                                        <Heart color="#FF4E7E" size={42} fill="#FF4E7E" />
                                    </View>
                                </LinearGradient>
                                <LinearGradient
                                    colors={['#E6C27A', '#9B7C3E']}
                                    style={styles.levelBanner}
                                >
                                    <Text style={styles.levelBannerText}>LV.{cpLevel}</Text>
                                </LinearGradient>
                            </View>

                            {/* Right Wing Majestic Feather Layers */}
                            <View style={[styles.wingContainer, styles.rightWingPosition]}>
                                <View style={[styles.wingFeather, styles.rightFeather1]} />
                                <View style={[styles.wingFeather, styles.rightFeather2]} />
                                <View style={[styles.wingFeather, styles.rightFeather3]} />
                                <View style={[styles.wingFeather, styles.rightFeather4]} />
                            </View>
                        </View>

                        {/* Gained Progress Box (Glass Panel container 100% matching Layout) */}
                        <View style={styles.gainedGlassPanel}>
                            <View style={styles.gainedBadge}>
                                <Text style={styles.gainedText}>Gained</Text>
                            </View>
                            <View style={styles.progressTrack}>
                                <LinearGradient
                                    colors={['#E6C27A', '#F59E0B']}
                                    style={[styles.progressFill, { width: '45%' }]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                />
                            </View>
                            <Text style={styles.progressText}>900 / 2,000 EXP</Text>
                        </View>

                        {/* Identity Banner Ribbon with wing-tip decors */}
                        <View style={styles.identityRibbonWrapper}>
                            <View style={styles.identityWingLeft} />
                            <LinearGradient
                                colors={['#E6C27A', '#9B7C3E']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.identityRibbon}
                            >
                                <Text style={styles.identityRibbonDecor}>✦</Text>
                                <Text style={styles.identityRibbonText}>Identity</Text>
                                <Text style={styles.identityRibbonDecor}>✦</Text>
                            </LinearGradient>
                            <View style={styles.identityWingRight} />
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>

            {/* Bottom Grid Sheet - 3 Column Layout matching the first image layout */}
            <View style={styles.bottomSheet}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.privilegesGrid}>
                        {PRIVILEGES.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.gridCard}
                                activeOpacity={0.8}
                                onPress={() => setSelectedPrivilege(item)}
                            >
                                <View style={styles.cardInnerBox}>
                                    {renderPrivilegeIcon(item.iconType)}
                                </View>
                                <Text style={styles.cardTitle} numberOfLines={2}>
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Privilege Details Modal */}
            <Modal
                visible={selectedPrivilege !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedPrivilege(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContentSmall}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedPrivilege?.title}</Text>
                            <TouchableOpacity onPress={() => setSelectedPrivilege(null)} style={styles.modalCloseBtn}>
                                <X color="#E6C27A" size={24} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBodySmall}>
                            <View style={styles.modalIconContainer}>
                                {selectedPrivilege && renderPrivilegeIcon(selectedPrivilege.iconType, true)}
                            </View>
                            <Text style={styles.privilegeModalDescription}>
                                {selectedPrivilege?.description}
                            </Text>
                            <TouchableOpacity
                                style={styles.privilegeModalCloseBtn}
                                onPress={() => setSelectedPrivilege(null)}
                            >
                                <Text style={styles.privilegeModalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Dropdown Options Modal */}
            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.menuOverlay}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.menuDropdownContainer}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleDivorce}>
                            <Text style={styles.menuItemText}>Divorce</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={handleRule}>
                            <Text style={styles.menuItemText}>Rule</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* CP House Theme Selector Bottom Modal */}
            <Modal
                visible={themeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setThemeModalVisible(false)}
            >
                <View style={styles.bottomSheetOverlay}>
                    <TouchableOpacity
                        style={styles.backdropPressable}
                        activeOpacity={1}
                        onPress={() => setThemeModalVisible(false)}
                    />
                    <View style={styles.themeSheetContainer}>
                        <Text style={styles.themeSheetTitle}>CP House Theme</Text>

                        {/* Main Preview Container */}
                        <View style={styles.themePreviewWrapper}>
                            <Image
                                source={{ uri: roomBackground }}
                                style={styles.themePreviewImage}
                                resizeMode="cover"
                            />
                            {/* Pencil Edit Icon in Top Right */}
                            <TouchableOpacity
                                style={styles.themeEditBtn}
                                onPress={handleSelectCustomTheme}
                                activeOpacity={0.8}
                            >
                                <Pencil color="#E6C27A" size={18} />
                            </TouchableOpacity>
                        </View>

                        {/* Thumbnails Row */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.themesHorizontalScroll}
                        >
                            {themes.map((theme) => {
                                const isSelected = roomBackground === theme.url;
                                return (
                                    <TouchableOpacity
                                        key={theme.id}
                                        style={[
                                            styles.themeThumbnailCard,
                                            isSelected && styles.themeThumbnailSelected
                                        ]}
                                        onPress={() => setRoomBackground(theme.url)}
                                        activeOpacity={0.85}
                                    >
                                        <Image
                                            source={{ uri: theme.url }}
                                            style={styles.themeThumbnailImage}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.themeLevelBadgeMini}>
                                            <Text style={styles.themeLevelTextMini}>{theme.label}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0806',
    },
    topSection: {
        width: '100%',
        height: 470,
    },
    gradientOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingBottom: 0,
    },
    safeHeader: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 15,
        paddingBottom: 12,
    },
    backBtn: {
        padding: 6,
        backgroundColor: 'rgba(230, 194, 122, 0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.1)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E6C27A',
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
        textShadowOffset: { width: 1, height: 1.5 },
        textShadowRadius: 4,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIconBtn: {
        padding: 6,
        backgroundColor: 'rgba(230, 194, 122, 0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.1)',
    },
    archCenterpiece: {
        alignItems: 'center',
        marginTop: 50,
    },
    wingedHeartRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 120,
        width: '100%',
    },
    emblemContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        position: 'relative',
    },
    heartEmblem: {
        width: 106,
        height: 106,
        borderRadius: 53,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderColor: '#E6C27A',
        shadowColor: '#9B7C3E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 6,
    },
    innerEmblemHeart: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255, 78, 126, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelBanner: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#E6C27A',
        borderColor: '#9B7C3E',
        borderWidth: 1.5,
        borderRadius: 14,
        paddingHorizontal: 22,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 3,
        elevation: 5,
        zIndex: 12,
    },
    levelBannerText: {
        color: '#0B0806',
        fontSize: 14,
        fontWeight: '900',
    },
    crownDecoration: {
        position: 'absolute',
        top: -12,
        zIndex: 11,
    },
    emblemLevelText: {
        color: '#0B0806',
        fontSize: 18,
        fontWeight: '900',
    },
    // Majestic layered feathered wings on left & right sides
    wingContainer: {
        position: 'absolute',
        width: 110,
        height: 110,
        top: 20,
    },
    leftWingPosition: {
        left: '8%',
    },
    rightWingPosition: {
        right: '8%',
        transform: [{ scaleX: -1 }],
    },
    wingFeather: {
        backgroundColor: 'rgba(230, 194, 122, 0.28)',
        borderRadius: 15,
        position: 'absolute',
    },
    leftFeather1: {
        width: 75,
        height: 22,
        borderRadius: 11,
        transform: [{ rotate: '-35deg' }],
        top: 10,
        left: 20,
        opacity: 0.9,
    },
    leftFeather2: {
        width: 85,
        height: 24,
        borderRadius: 12,
        transform: [{ rotate: '-12deg' }],
        top: 34,
        left: 10,
        backgroundColor: 'rgba(230, 194, 122, 0.22)',
        opacity: 0.8,
    },
    leftFeather3: {
        width: 75,
        height: 22,
        borderRadius: 11,
        transform: [{ rotate: '10deg' }],
        top: 60,
        left: 15,
        backgroundColor: 'rgba(230, 194, 122, 0.16)',
        opacity: 0.7,
    },
    leftFeather4: {
        width: 55,
        height: 18,
        borderRadius: 9,
        transform: [{ rotate: '30deg' }],
        top: 84,
        left: 30,
        backgroundColor: 'rgba(230, 194, 122, 0.1)',
        opacity: 0.6,
    },
    rightFeather1: {
        width: 75,
        height: 22,
        borderRadius: 11,
        transform: [{ rotate: '-35deg' }],
        top: 10,
        left: 20,
        opacity: 0.9,
    },
    rightFeather2: {
        width: 85,
        height: 24,
        borderRadius: 12,
        transform: [{ rotate: '-12deg' }],
        top: 34,
        left: 10,
        backgroundColor: 'rgba(230, 194, 122, 0.22)',
        opacity: 0.8,
    },
    rightFeather3: {
        width: 75,
        height: 22,
        borderRadius: 11,
        transform: [{ rotate: '10deg' }],
        top: 60,
        left: 15,
        backgroundColor: 'rgba(230, 194, 122, 0.16)',
        opacity: 0.7,
    },
    rightFeather4: {
        width: 55,
        height: 18,
        borderRadius: 9,
        transform: [{ rotate: '30deg' }],
        top: 84,
        left: 30,
        backgroundColor: 'rgba(230, 194, 122, 0.1)',
        opacity: 0.6,
    },
    // Glass panel container matching layout 100%
    gainedGlassPanel: {
        width: '90%',
        backgroundColor: 'rgba(18, 14, 11, 0.75)',
        borderRadius: 24,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        paddingVertical: 14,
        paddingHorizontal: 22,
        alignItems: 'center',
        marginTop: 40,
    },
    gainedBadge: {
        backgroundColor: '#FF4E7E',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 14,
        marginBottom: 8,
    },
    gainedText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    progressTrack: {
        width: '100%',
        height: 10,
        backgroundColor: '#221811',
        borderRadius: 5,
        overflow: 'hidden',
        marginVertical: 4,
    },
    progressFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 11,
        color: '#8B7A6A',
        fontWeight: '700',
        marginTop: 4,
    },
    identityRibbonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        //marginBottom: -18
    },
    identityRibbon: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 36,
        paddingVertical: 9,
        borderRadius: 24,
        borderWidth: 1.2,
        borderColor: '#E6C27A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
        zIndex: 2,
    },
    identityRibbonDecor: {
        color: '#0B0806',
        fontSize: 12,
        fontWeight: 'bold',
        marginHorizontal: 6,
    },
    identityRibbonText: {
        color: '#0B0806',
        fontSize: 14,
        fontWeight: 'bold',
    },
    identityWingLeft: {
        width: 20,
        height: 12,
        backgroundColor: 'rgba(230, 194, 122, 0.15)',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: -10,
        transform: [{ rotate: '-15deg' }],
    },
    identityWingRight: {
        width: 20,
        height: 12,
        backgroundColor: 'rgba(230, 194, 122, 0.15)',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginLeft: -10,
        transform: [{ rotate: '15deg' }],
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: '#0B0806',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: 40,
        padding: 16,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    privilegesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    gridCard: {
        width: (width - 32 - 24) / 3,
        height: 135,
        backgroundColor: '#120E0B',
        borderRadius: 20,
        borderWidth: 1.2,
        borderColor: 'rgba(230, 194, 122, 0.15)',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    cardInnerBox: {
        width: 58,
        height: 58,
        borderRadius: 14,
        backgroundColor: '#FFFFFF', // 100% matches the white box layout of the first image
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    cardTitle: {
        fontSize: 10.5,
        color: '#E6C27A',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 14,
    },
    iconCardFrame: {
        width: 38,
        height: 26,
        borderRadius: 5,
        padding: 2,
        borderWidth: 1.2,
        borderColor: '#FF4E7E',
    },
    iconCardFrameLarge: {
        width: 72,
        height: 50,
        borderRadius: 10,
        padding: 4,
        borderWidth: 2,
    },
    iconCardInner: {
        flex: 1,
        backgroundColor: 'rgba(255, 78, 126, 0.25)',
        borderRadius: 3,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleLarge: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: '#E6C27A',
    },
    overlapAvatarsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    overlapAvatarsWrapperLarge: {
        transform: [{ scale: 1.5 }],
        marginVertical: 12,
    },
    overlapAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
    },
    overlapAvatarLarge: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    overlapAvatarHeart: {
        position: 'absolute',
        top: -6,
        left: 16,
        zIndex: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 2,
        borderWidth: 1,
        borderColor: '#E6C27A',
    },
    overlapAvatarHeartLarge: {
        top: -8,
        left: 32,
        padding: 3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContentSmall: {
        width: '85%',
        backgroundColor: '#120E0B',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: '#E6C27A',
        overflow: 'hidden',
        paddingBottom: 20,
    },
    modalHeader: {
        height: 52,
        backgroundColor: '#1C1612',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottomWidth: 1.2,
        borderBottomColor: 'rgba(230, 194, 122, 0.15)',
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
    modalBodySmall: {
        padding: 20,
        alignItems: 'center',
    },
    modalIconContainer: {
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    privilegeModalDescription: {
        color: '#A08B7D',
        fontSize: 13.5,
        lineHeight: 20,
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 20,
    },
    privilegeModalCloseBtn: {
        backgroundColor: '#E6C27A',
        paddingHorizontal: 36,
        paddingVertical: 10,
        borderRadius: 20,
    },
    privilegeModalCloseText: {
        color: '#0B0806',
        fontWeight: 'bold',
        fontSize: 14,
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuDropdownContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 48 : 88,
        right: 16,
        backgroundColor: '#1C1612',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 18,
        minWidth: 125,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(230, 194, 122, 0.15)',
    },
    menuItem: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    menuItemText: {
        color: '#E6C27A',
        fontSize: 15,
        fontWeight: '600',
    },
    bottomSheetOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    themeSheetContainer: {
        backgroundColor: '#0B0806',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        maxHeight: '75%',
        borderWidth: 1.5,
        borderColor: 'rgba(230, 194, 122, 0.15)',
    },
    themeSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E6C27A',
        textAlign: 'center',
        marginBottom: 20,
    },
    themePreviewWrapper: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(230, 194, 122, 0.25)',
    },
    themePreviewImage: {
        width: '100%',
        height: '100%',
    },
    themeEditBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(11, 8, 6, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E6C27A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    themesHorizontalScroll: {
        paddingVertical: 4,
        gap: 16,
    },
    themeThumbnailCard: {
        width: 68,
        height: 68,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    themeThumbnailSelected: {
        borderColor: '#E6C27A',
        shadowColor: '#E6C27A',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 5,
    },
    themeThumbnailImage: {
        width: '100%',
        height: '100%',
    },
    themeLevelBadgeMini: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(11, 8, 6, 0.65)',
        paddingVertical: 2,
        alignItems: 'center',
    },
    themeLevelTextMini: {
        color: '#E6C27A',
        fontSize: 8.5,
        fontWeight: 'bold',
    },
    backdropPressable: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    }
});
