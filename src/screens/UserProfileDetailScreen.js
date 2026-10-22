import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronLeft, Pencil, MapPin, Plus, ChevronRight, Car, Frame, Medal, Gift, User2, Heart, Armchair, Lock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { colors } from '../styles/globalStyles';
import apiService from '../services/apiService';

const { width } = Dimensions.get('window');

export default function UserProfileDetailScreen({ route }) {
    const navigation = useNavigation();
    const { profile: currentUserProfile, userId: currentUserId } = useSelector(state => state.auth);
    const searchedProfile = route.params?.searchedProfile;
    const userId = route.params?.userId || searchedProfile?.id; // Support both ways of passing ID
    const [activeTab, setActiveTab] = useState('Profile'); // Profile | Intimacy
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [fetchedProfile, setFetchedProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (userId) {
                try {
                    let url = `api/User/${currentUserId}/profile`;
                    if (userId) {
                        url += `?visitorUserId=${userId}`;
                    }
                    const response = await apiService.get(url);
                    if (response.success && response.data) {
                        setFetchedProfile(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
        };
        fetchUserProfile();
    }, [userId, currentUserId]);

    // Prioritize fetched profile, then searchedProfile, then currentUserProfile
    const profile = fetchedProfile || searchedProfile || currentUserProfile;

    // Map profile data to screen data
    const user = {
        name: profile?.name || profile?.displayName || "LavaChat User",
        id: profile?.profileId || profile?.id || "N/A",
        gender: profile?.gender || "male",
        age: 18, // Default or calculate from DOB if available
        followers: profile?.followers || 0,
        level: 2,    // Placeholder
        location: profile?.countryName || profile?.country || "India",
        avatar: profile?.profilePictureUrl || profile?.avatarUrl || null
    };

    return (
        <View style={styles.container}>

            {/* BACKGROUND IMAGE - Full screen absolute or top half */}
            <Image
                source={profile?.backgroundPhotoUrl ? { uri: `https://landing.hostingsky.in${profile.backgroundPhotoUrl}` } : require('../assets/av1.jpg')} // Placeholder background as fallback
                style={styles.backgroundImage}
                blurRadius={5}
            />
            <View style={styles.darkOverlay} />

            {/* HEADER NAVBAR */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft color="#fff" size={30} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditModalVisible(true)}>
                    <Pencil color="#fff" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>

                {/* TOP INFO SECTION */}
                <View style={styles.topSection}>
                    <Image
                        source={user.avatar ? { uri: user.avatar } : require('../assets/av1.jpg')}
                        style={styles.avatar}
                    />
                    <View style={styles.nameRow}>
                        <Text style={styles.nameText}>{user.name}</Text>
                        <View style={styles.genderBadge}>
                            <Text style={styles.genderText}>♂ {user.age}</Text>
                        </View>
                    </View>

                    <View style={styles.idRow}>
                        <View style={styles.idBadge}>
                            <Text style={styles.idText}>ID:{user.id}</Text>
                        </View>
                        <View style={styles.followBadge}>
                            <Text style={styles.followText}>{user.followers} followers</Text>
                        </View>
                    </View>

                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>🏆 LV.{user.level}</Text>
                    </View>
                </View>

                {/* BOTTOM WHITE SHEET */}
                <View style={styles.bottomSheet}>

                    {/* TABS */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity onPress={() => setActiveTab('Profile')} style={styles.tabBtn}>
                            <Text style={[styles.tabText, activeTab === 'Profile' && styles.activeTabText]}>Profile</Text>
                            {activeTab === 'Profile' && <View style={styles.activeLine} />}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setActiveTab('Intimacy')} style={styles.tabBtn}>
                            <Text style={[styles.tabText, activeTab === 'Intimacy' && styles.activeTabText]}>Intimacy</Text>
                            {activeTab === 'Intimacy' && <View style={styles.activeLine} />}
                        </TouchableOpacity>
                    </View>

                    {/* CONTENT */}
                    <View style={styles.contentContainer}>

                        {activeTab === 'Profile' ? (
                            <>
                                {/* LOCATION */}
                                <View style={styles.locationRow}>
                                    <MapPin size={16} color="#666" />
                                    <Text style={styles.locationText}>{user.location}</Text>
                                </View>

                                {/* FAMILY CARD */}
                                <View style={styles.familyCard}>
                                    <View style={styles.familyIconWrapper}>
                                        <Plus size={20} color="#fff" />
                                    </View>
                                    <Text style={styles.familyText}>Go join the family and get your reward</Text>
                                    <TouchableOpacity style={styles.joinBtn}>
                                        <Text style={styles.joinBtnText}>Join</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* TAGS */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Tags</Text>
                                    <TouchableOpacity>
                                        <ChevronRight size={20} color="#ccc" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.addTagBtn}>
                                    <Plus size={16} color="#fff" />
                                    <Text style={styles.addTagText}>Edit my tags</Text>
                                </TouchableOpacity>

                                {/* PHOTO */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Photo</Text>
                                </View>
                                <View style={styles.emptyStateBox}>
                                    <Image source={require('../assets/logo.jpg')} style={{ width: 40, height: 40, opacity: 0.2 }} />
                                    <Text style={styles.emptyStateText}>No photos yet</Text>
                                </View>

                                {/* VEHICLES */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Vehicles</Text>
                                    <TouchableOpacity><ChevronRight size={20} color="#ccc" /></TouchableOpacity>
                                </View>
                                <View style={styles.emptyStateBox}>
                                    <Car color="#d9e3f0" size={40} />
                                    <Text style={styles.emptyStateText}>No cars yet</Text>
                                </View>

                                {/* FRAMES */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Frames</Text>
                                    <TouchableOpacity><ChevronRight size={20} color="#ccc" /></TouchableOpacity>
                                </View>
                                <View style={styles.emptyStateBox}>
                                    <Frame color="#d9e3f0" size={40} />
                                    <Text style={styles.emptyStateText}>No frames yet</Text>
                                </View>

                                {/* MEDAL */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Medal</Text>
                                </View>
                                <View style={styles.emptyStateBox}>
                                    <Medal color="#d9e3f0" size={40} />
                                    <Text style={styles.emptyStateText}>No medal yet</Text>
                                </View>

                                {/* GIFT RECEIVED */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Gift Received</Text>
                                </View>
                                <View style={styles.emptyStateBox}>
                                    <Gift color="#d9e3f0" size={40} />
                                    <Text style={styles.emptyStateText}>Haven't received the gift yet</Text>
                                </View>
                            </>
                        ) : (
                            /* INTIMACY TAB CONTENT */
                            <View style={{ marginTop: 10 }}>

                                {/* LOVE STORE BANNER */}
                                <LinearGradient
                                    colors={[colors.gradPremiumStart, colors.gradPremiumEnd]}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    style={styles.loveStoreBanner}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Heart size={20} color={colors.text} fill={colors.text} style={{ marginRight: 8 }} />
                                        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 14 }}>Love Store</Text>
                                    </View>
                                    <TouchableOpacity style={styles.goBtn}>
                                        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 12 }}>Go</Text>
                                    </TouchableOpacity>
                                </LinearGradient>

                                {/* COUPLE SECTION */}
                                <View style={styles.sectionHeader}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.sectionTitle}>Couple</Text>
                                        <View style={{ marginLeft: 5, backgroundColor: '#eee', borderRadius: 10, paddingHorizontal: 4 }}>
                                            <Text style={{ fontSize: 10, color: '#999' }}>?</Text>
                                        </View>
                                    </View>
                                </View>

                                <LinearGradient
                                    colors={[colors.gradMainStart, colors.gradMainEnd]}
                                    style={styles.coupleCard}
                                >
                                    {/* Left User */}
                                    <View style={{ alignItems: 'center' }}>
                                        <Image source={user.avatar ? { uri: user.avatar } : require('../assets/av1.jpg')} style={styles.coupleAvatar} />
                                        <Text style={styles.coupleName}>{user.name.substring(0, 8)}...</Text>
                                    </View>

                                    {/* Center Heart */}
                                    <View style={{ alignItems: 'center' }}>
                                        <Heart size={32} color="#fff" fill="#fff" />
                                    </View>

                                    {/* Right Add */}
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={styles.addCircle}>
                                            <Plus size={24} color="#fff" />
                                        </View>
                                        <Text style={styles.coupleName}>None</Text>
                                    </View>
                                </LinearGradient>

                                {/* SUPPORTERS */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Supporters</Text>
                                    <ChevronRight size={20} color="#ccc" />
                                </View>
                                <View style={styles.supporterEmptyBox}>
                                    <Text style={{ color: '#999', fontSize: 12 }}>Nothing at all ~</Text>
                                </View>

                                {/* FRIEND */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Friend</Text>
                                </View>
                                <View style={styles.friendGrid}>
                                    {/* 3 Empty Slots */}
                                    {[1, 2, 3].map((item) => (
                                        <View key={item} style={styles.friendSlot}>
                                            <Armchair size={24} color={colors.secondary} />
                                            <Text style={{ color: colors.textDim, fontSize: 10, marginTop: 4 }}>Add</Text>
                                        </View>
                                    ))}

                                    {/* Locked Slot */}
                                    <View style={styles.friendSlot}>
                                        <Lock size={20} color={colors.secondary} />
                                        <Text style={{ color: colors.textDim, fontSize: 10, marginTop: 4 }}>Unlock</Text>
                                    </View>
                                </View>

                            </View>
                        )}

                    </View>

                </View>

            </ScrollView>

            {/* EDIT PROFILE MODAL */}
            <Modal
                transparent={true}
                visible={isEditModalVisible}
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setEditModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        {/* Handle bar */}
                        <View style={styles.modalHandle} />

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => {
                                setEditModalVisible(false);
                                navigation.navigate('EditProfileScreen');
                            }}
                        >
                            <Text style={styles.modalOptionText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <View style={styles.modalDivider} />

                        <TouchableOpacity style={styles.modalOption}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.modalOptionText}>Change Cover</Text>
                                <View style={styles.lockBadge}>
                                    <View style={{ marginRight: 2 }}><Text style={{ fontSize: 8 }}>🔒</Text></View>
                                    <Text style={styles.lockText}>LV.25</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setEditModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 350,
        resizeMode: 'cover',
    },
    darkOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 350,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    topSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#fff',
        marginBottom: 10,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 8,
    },
    genderBadge: {
        backgroundColor: '#00BFFF', // Blue for male
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    genderText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    idRow: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 8
    },
    idBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    idText: {
        color: '#fff',
        fontSize: 11,
    },
    followBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    followText: {
        color: '#fff',
        fontSize: 11,
    },
    levelBadge: {
        backgroundColor: '#8A2BE2', // Violet
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    levelText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },

    /* BOTTOM SHEET */
    bottomSheet: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 500,
        paddingTop: 15,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 15,
        gap: 20,
    },
    tabBtn: {
        paddingBottom: 5,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textDim,
    },
    activeTabText: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    activeLine: {
        height: 3,
        backgroundColor: colors.primary,
        width: 20,
        marginTop: 4,
        borderRadius: 2,
        alignSelf: 'center',
    },

    contentContainer: {
        paddingHorizontal: 20,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 5,
    },
    locationText: {
        color: colors.textDim,
        fontSize: 14,
    },

    /* FAMILY CARD */
    familyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: 10,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    familyIconWrapper: {
        width: 36,
        height: 36,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    familyText: {
        flex: 1,
        fontSize: 13,
        color: colors.text,
    },
    joinBtn: {
        backgroundColor: colors.tertiary,
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
    },
    joinBtnText: {
        color: colors.background,
        fontWeight: 'bold',
        fontSize: 12,
    },

    /* SECTION HEADERS */
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    addTagBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 20,
    },
    addTagText: {
        color: colors.background,
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 4,
    },

    /* EMPTY STATES */
    emptyStateBox: {
        backgroundColor: colors.card,
        width: '100%',
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginBottom: 10,
        minHeight: 100,
        borderWidth: 1,
        borderColor: colors.border,
    },
    emptyStateText: {
        color: colors.textDim,
        marginTop: 10,
        fontSize: 12,
    },
    /* MODAL STYLES */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.textDim,
        borderRadius: 2,
        marginBottom: 20,
    },
    modalOption: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
    },
    modalOptionText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    modalDivider: {
        width: '100%',
        height: 1,
        backgroundColor: colors.border,
    },
    lockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: colors.border
    },
    lockText: {
        color: colors.tertiary,
        fontSize: 10,
        fontWeight: 'bold'
    },

    cancelBtn: {
        marginTop: 15,
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: colors.background,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
    },
    /* NEW INTIMACY STYLES */
    loveStoreBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 20,
        marginBottom: 20,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    goBtn: {
        backgroundColor: colors.background,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
    },
    coupleCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.primary,
        marginBottom: 20,
        backgroundColor: colors.card,
    },
    coupleAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.text,
        marginBottom: 5,
    },
    coupleName: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    addCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.text,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    supporterEmptyBox: {
        backgroundColor: colors.card,
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    friendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    friendSlot: {
        width: '30%', // Grid of 3
        aspectRatio: 0.8,
        borderWidth: 1,
        borderColor: colors.secondary, // Highlight Purple border
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    }
});
